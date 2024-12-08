use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Step {
    pub step_type: String,
    pub from: u32,
    pub to: u32,
    pub marks: Vec<Mark>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Mark {
    pub type_: String,
    pub attrs: Option<serde_json::Value>,
}