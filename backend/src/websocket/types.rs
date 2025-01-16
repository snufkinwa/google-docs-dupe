use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct EditorState {
    pub doc: Doc,
    pub selection: Selection,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Doc {
    #[serde(rename = "type_")]
    pub type_: String,
    pub content: Vec<Node>,
}

#[derive(Clone, Serialize, Deserialize, Default)]
pub struct Node {
    #[serde(rename = "type_")]
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

#[derive(Clone, Serialize, Deserialize, Debug)] 
pub struct Mark {
    pub type_: String,
    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub attrs: Option<serde_json::Value>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Selection {
    pub anchor: u32,
    pub head: u32,
}

#[derive(Clone, Serialize, Deserialize, Debug)] 
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

#[derive(Clone, Serialize, Deserialize)]
pub struct WebSocketMessage {
    #[serde(rename = "type_")]
    pub type_: String,
    pub doc_id: String,
    pub content: EditorState,
    pub version: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub steps: Option<Vec<Step>>,
}


impl Doc {
    pub fn validate(&self) -> Result<(), String> {
        if self.type_ != "doc" {
            return Err("Document root must be of type 'doc'".to_string());
        }
        for node in &self.content {
            node.validate()?;
        }
        Ok(())
    }
}

impl Node {
    pub fn validate(&self) -> Result<(), String> {
        if self.type_.is_empty() {
            return Err("Node type cannot be empty".to_string());
        }
        if let Some(content) = &self.content {
            for child in content {
                child.validate()?;
            }
        }
        Ok(())
    }
}
