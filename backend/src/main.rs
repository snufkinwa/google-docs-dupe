use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    routing::get,
    Router,
};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::{broadcast, Mutex};
use tokio::task::JoinHandle;

#[tokio::main]
async fn main() {
    // Shared state: the collaborative document
    let shared_doc = Arc::new(Mutex::new(String::new()));

    // Broadcast channel for real-time updates
    let (tx, _) = broadcast::channel(100);

    // Create the WebSocket route
    let app = Router::new()
        .route("/ws", get({
            let shared_doc = shared_doc.clone();
            move |ws| ws_handler(ws, shared_doc.clone(), tx.clone())
        }));

    // Start the server
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("WebSocket server running at ws://{}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// WebSocket handler
async fn ws_handler(
    ws: WebSocketUpgrade,
    shared_doc: Arc<Mutex<String>>,
    tx: broadcast::Sender<String>,
) -> impl axum::response::IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, shared_doc, tx))
}

// Handle WebSocket connection
async fn handle_socket(
    socket: WebSocket,
    shared_doc: Arc<Mutex<String>>,
    tx: broadcast::Sender<String>,
) {
    println!("New WebSocket connection established");

    let socket = Arc::new(Mutex::new(socket)); 
    let mut rx = tx.subscribe();

    // Spawn a task to send updates to the client
    let socket_writer = socket.clone(); 
    let send_task: JoinHandle<()> = tokio::spawn(async move {
        while let Ok(updated_doc) = rx.recv().await {
            let mut socket = socket_writer.lock().await;
            if socket.send(Message::Text(updated_doc)).await.is_err() {
                println!("Error sending message to client");
                break;
            }
        }
    });

    // Main loop to handle client messages
    while let Some(Ok(message)) = socket.lock().await.recv().await {
        println!("Received message from client: {:?}", message); 

        if let Message::Text(client_edit) = message {
            // Update the shared document
            {
                let mut doc = shared_doc.lock().await;
                doc.push_str(&client_edit); 
            }

            // Broadcast the updated document
            let updated_doc = shared_doc.lock().await.clone();
            println!("Broadcasting: {}", updated_doc);
            let _ = tx.send(updated_doc);
        }
    }

    // Ensure the send task is stopped
    send_task.abort();
}
