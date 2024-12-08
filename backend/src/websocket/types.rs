use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)] // Add derive here
pub struct EditorState {
    pub doc: Doc,
    pub selection: Selection,
}

#[derive(Clone, Serialize, Deserialize)] // Add derive here
pub struct Doc {
    #[serde(rename = "type")]
    pub type_: String,
    pub content: Vec<Node>,
}

#[derive(Clone, Serialize, Deserialize, Default)] // Add derive here
pub struct Node {
    #[serde(rename = "type")]
    pub type_: String,
    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub attrs: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub marks: Option<Vec<Mark>>,
    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub content: Option<Vec<Node>>,
    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub text: Option<String>,
}

#[derive(Clone, Serialize, Deserialize)] // Add derive here
pub struct Mark {
    pub type_: String,
    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub attrs: Option<serde_json::Value>,
}

#[derive(Clone, Serialize, Deserialize)] // Add derive here
pub struct Selection {
    pub anchor: u32,
    pub head: u32,
}

#[derive(Clone, Serialize, Deserialize)] // Add derive here
#[serde(tag = "stepType", content = "args")]
pub enum Step {
    Replace {
        from: u32,
        to: u32,
        slice: Option<serde_json::Value>,
    },
    AddMark {
        from: u32,
        to: u32,
        mark: Mark,
    },
    RemoveMark {
        from: u32,
        to: u32,
        mark: Mark,
    },
}

#[derive(Clone, Serialize, Deserialize)] // Add derive here
pub struct WebSocketMessage {
    pub type_: String,
    pub doc_id: String,
    pub content: EditorState,
    pub version: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub steps: Option<Vec<Step>>,
}
