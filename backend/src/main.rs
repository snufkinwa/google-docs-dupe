use axum::{
    routing::{get, post},
    extract::ws::WebSocketUpgrade,
    response::IntoResponse,
    Json, Router, Server,
};
use std::sync::Arc;
use std::env;
use tokio::sync::broadcast;
use tower_http::services::ServeDir;

mod db;
mod editor;
mod websocket;
mod types;

use db::mongodb::MongoDB;
use types::{User as TypesUser, ShareRequest};
use websocket::handler::WebSocketHandler;

#[tokio::main]
async fn main() {
    let mongodb_uri = env::var("MONGODB_URI").expect("MONGODB_URI must be set in .env");

    // Initialize MongoDB
    let mongo = Arc::new(MongoDB::new(&mongodb_uri).await.unwrap());

    let (tx, _) = broadcast::channel::<WebSocketMessage>(100);


    let app = Router::new()
        // MongoDB API routes
        .route("/api/users/sync", post(sync_user))
        .route("/api/documents/share", post(share_document))
        // WebSocket route
        .route("/ws/:doc_id", get(handle_websocket))
        // Static file serving
        .nest_service("/static", ServeDir::new("static"))
        // Catch-all route
        .fallback(handler_404)
        // Shared state
        .layer(axum::extract::Extension(mongo))
        .layer(axum::extract::Extension(Arc::new(tx)));

    // Start the server
    let addr = "127.0.0.1:3000".parse().unwrap();
    println!("Server listening on {}", addr);

    Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// WebSocket connection handler
async fn handle_websocket(
    ws: WebSocketUpgrade,
    axum::extract::Path(doc_id): axum::extract::Path<String>,
    axum::extract::Extension(tx): axum::extract::Extension<Arc<broadcast::Sender<WebSocketMessage>>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| {
        let mut handler = WebSocketHandler::new(socket, doc_id.clone(), tx.clone());
        async move { handler.handle().await }
    })
}

// MongoDB user synchronization handler
async fn sync_user(
    axum::extract::Extension(mongo): axum::extract::Extension<Arc<MongoDB>>,
    Json(user_data): Json<TypesUser>, // Explicitly use `types::User`
) -> impl IntoResponse {
    match mongo.save_user(user_data).await {
        Ok(_) => (axum::http::StatusCode::OK, "User synced successfully").into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", e)).into_response(),
    }
}


// MongoDB document sharing handler
async fn share_document(
    axum::extract::Extension(mongo): axum::extract::Extension<Arc<MongoDB>>,
    Json(payload): Json<types::ShareRequest>, // Assuming a `ShareRequest` struct is in `types`
) -> impl IntoResponse {
    match mongo.add_collaborator(&payload.doc_id, &payload.collaborator_id).await {
        Ok(_) => (axum::http::StatusCode::OK, "Collaborator added successfully").into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", e)).into_response(),
    }
}

// Fallback handler for unknown routes
async fn handler_404() -> impl IntoResponse {
    (axum::http::StatusCode::NOT_FOUND, "Route not found")
}
