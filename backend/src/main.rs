use axum::{
    extract::ws::WebSocketUpgrade, response::IntoResponse, routing::{get, post}, Json, Router, Server, Extension
};
use std::sync::Arc;
use std::env;
use dotenv::dotenv;
use tokio::sync::broadcast;
use tower_http::cors::{CorsLayer, Any};


mod db;
mod editor;
mod websocket;
mod types;

use db::mongodb::MongoDB;
use websocket::{handler::WebSocketHandler, types::WebSocketMessage};

#[tokio::main]
async fn main() {
    dotenv().ok();

    let mongodb_uri = env::var("MONGODB_URI").expect("MONGODB_URI must be set in .env");

    // Initialize MongoDB
    let mongo = Arc::new(MongoDB::new(&mongodb_uri).await.unwrap());

    let (tx, _) = broadcast::channel::<WebSocketMessage>(100);


    let cors = CorsLayer::new()
    .allow_origin(Any) 
    .allow_methods(Any)
    .allow_headers(Any);


    let app = Router::new()
        .route("/api/users/sync", post(sync_user))
        .route("/api/documents/share", post(share_document))
        .route("/ws/:doc_id", get(handle_websocket))
        .fallback(handler_404) 
        .layer(Extension(mongo.clone())) 
        .layer(Extension(Arc::new(tx.clone())))
        .layer(cors);


    let addr = "127.0.0.1:8080".parse().unwrap();
    println!("Server listening on {}", addr);

    Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handle_websocket(
    ws: WebSocketUpgrade,
    axum::extract::Path(doc_id): axum::extract::Path<String>,
    axum::extract::Extension(tx): axum::extract::Extension<Arc<broadcast::Sender<WebSocketMessage>>>,
) -> impl IntoResponse {
    let tx = tx.as_ref().clone();
    ws.on_upgrade(|socket| async move {
        let mut handler = WebSocketHandler::new(socket, doc_id, tx);
        handler.handle().await;
    })
}


// MongoDB user synchronization handler
async fn sync_user(
    axum::extract::Extension(mongo): axum::extract::Extension<Arc<MongoDB>>,
    Json(user_data): Json<types::User>,
) -> impl IntoResponse {
    if let Ok(Some(existing_user)) = mongo.get_user(&user_data._id).await {
        println!("Existing user found: {:?}", existing_user);
    }

    let mongo_user = db::mongodb::User {
        _id: user_data._id,
        email: user_data.email,
        name: user_data.name,
        profile_pic: user_data.profile_pic,
    };

    match mongo.save_user(mongo_user).await {
        Ok(_) => (axum::http::StatusCode::OK, "User synced successfully").into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", e)).into_response(),
    }
}



// MongoDB document sharing handler
async fn share_document(
    axum::extract::Extension(mongo): axum::extract::Extension<Arc<MongoDB>>,
    Json(payload): Json<types::ShareRequest>,
) -> impl IntoResponse {
    // Check if the document exists
    match mongo.get_document(&payload.doc_id).await {
        Ok(Some(_)) => {
            // If document exists, add collaborator
            match mongo.add_collaborator(&payload.doc_id, &payload.collaborator_id).await {
                Ok(_) => (axum::http::StatusCode::OK, "Collaborator added successfully").into_response(),
                Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", e)).into_response(),
            }
        }
        Ok(None) => (axum::http::StatusCode::NOT_FOUND, "Document not found").into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", e)).into_response(),
    }
}


// Fallback handler for unknown routes
async fn handler_404() -> impl IntoResponse {
    (axum::http::StatusCode::NOT_FOUND, "Route not found")
}
