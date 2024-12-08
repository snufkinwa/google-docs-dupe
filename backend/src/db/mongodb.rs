use mongodb::{bson::doc, options::ClientOptions, Client, Collection};
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
pub struct DocumentData {
    pub _id: String,
    pub content: mongodb::bson::Document,
    pub version: u32,
    pub updated_at: DateTime<Utc>,
    pub owner_id: String,
    pub collaborators: Vec<String>,
}

pub struct MongoDB {
    client: Client,
}

impl MongoDB {
    pub async fn new(uri: &str) -> mongodb::error::Result<Self> {
        let options = ClientOptions::parse(uri).await?;
        let client = Client::with_options(options)?;
        Ok(Self { client })
    }

    pub async fn save_user(&self, user: User) -> mongodb::error::Result<()> {
        let collection: Collection<User> = self.client.database("docuvy").collection("users");
        let options = mongodb::options::ReplaceOptions::builder().upsert(true).build(); // Build ReplaceOptions
        collection
            .replace_one(
                doc! { "_id": &user._id }, // Filter
                user,                      // Replacement document
            )
            .await?;
        Ok(())
    }
    

    pub async fn add_collaborator(&self, doc_id: &str, collaborator_id: &str) -> mongodb::error::Result<()> {
        let collection: Collection<DocumentData> = self.client.database("docuvy").collection("documents");
        collection
            .update_one(
                doc! { "_id": doc_id },
                doc! { "$addToSet": { "collaborators": collaborator_id } },
            )
            .await?;
        Ok(())
    }

    pub async fn get_user(&self, user_id: &str) -> mongodb::error::Result<Option<User>> {
        let collection: Collection<User> = self.client.database("docuvy").collection("users");
        collection.find_one(doc! { "_id": user_id }).await
    }

    pub async fn get_document(&self, doc_id: &str) -> mongodb::error::Result<Option<DocumentData>> {
        let collection: Collection<DocumentData> = self.client.database("docuvy").collection("documents");
        collection.find_one(doc! { "_id": doc_id }).await
    }

    pub async fn save_document(&self, doc_data: DocumentData) -> mongodb::error::Result<()> {
        let collection: Collection<DocumentData> = self.client.database("docuvy").collection("documents");
        collection
            .replace_one(
                doc! { "_id": &doc_data._id },
                doc_data,
            )
            .await?;
        Ok(())
    }
}
