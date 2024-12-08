use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Clone, Serialize, Deserialize)]
pub struct User {
    pub _id: String,
    pub email: String,
    pub name: String,
    pub profile_pic: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ShareRequest {
    pub doc_id: String,
    pub collaborator_id: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct DocumentUpdate {
    pub doc_id: String,
    pub content: String,
    pub version: u32,
    pub timestamp: DateTime<Utc>,
}