use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct DocumentState {
    pub id: String,
    pub content: serde_json::Value,
    pub version: u32,
}

