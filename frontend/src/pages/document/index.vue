<script setup>
const { data: documents } = await useFetch("/api/documents");
const { user } = useUser();

const templates = [
  { name: "Blank document", type: "blank" },
  { name: "Resume", type: "Serif", preview: "/api/placeholder/120/160" },
  { name: "Letter", type: "Spearmint", preview: "/api/placeholder/120/160" },
  { name: "Report", type: "Luxe", preview: "/api/placeholder/120/160" },
];

const createDocument = async (template) => {
  try {
    await $fetch("/api/documents", {
      method: "POST",
      body: {
        name: "Untitled Document",
        templateType: template.type,
      },
    });
    await refreshNuxtData();
  } catch (error) {
    console.error("Failed to create document:", error);
  }
};

const showDocumentMenu = (doc) => {
  // Add menu logic here
};
</script>

<template>
  <div class="documents">
    <header class="header">
      <button class="menu-btn">
        <Icon name="heroicons:bars-3" />
      </button>
      <img src="/docs-icon.png" alt="Docs" class="logo" />
      <h1>Docs</h1>

      <div class="search">
        <Icon name="heroicons:magnifying-glass" />
        <input type="text" placeholder="Search" />
      </div>

      <div class="header-actions">
        <button class="grid-btn">
          <Icon name="heroicons:squares-2x2" />
        </button>
        <img src="/api/placeholder/32/32" alt="Profile" class="profile" />
      </div>
    </header>

    <main>
      <div class="new-document">
        <div class="section-header">
          <h2>Start a new document</h2>
          <button class="template-btn">
            Template gallery
            <Icon name="heroicons:chevron-down" />
          </button>
        </div>

        <div class="templates-grid">
          <div
            v-for="template in templates"
            :key="template.name"
            class="template"
            @click="createDocument(template)"
          >
            <div class="template-preview">
              <template v-if="template.type === 'blank'">
                <div class="blank-plus">+</div>
              </template>
              <img v-else :src="template.preview" :alt="template.name" />
            </div>
            <div class="template-info">
              <p class="template-name">{{ template.name }}</p>
              <p class="template-type">{{ template.type }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-documents">
        <div v-if="documents?.length" class="documents-grid">
          <NuxtLink
            v-for="doc in documents"
            :key="doc.id"
            :to="`/documents/${doc.id}`"
            class="document"
          >
            <div class="document-preview">
              <img
                :src="doc.preview || '/api/placeholder/120/160'"
                :alt="doc.name"
              />
            </div>
            <div class="document-info">
              <div>
                <p class="document-name">{{ doc.name }}</p>
                <p class="document-date">
                  <Icon name="heroicons:document" />
                  {{ new Date(doc.updated_at).toLocaleDateString() }}
                </p>
              </div>
              <button class="more-btn" @click.prevent="showDocumentMenu(doc)">
                <Icon name="heroicons:ellipsis-vertical" />
              </button>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="no-documents">
          <p>No documents found</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
.documents {
  min-height: 100vh;
  background: #f8f9fa;

  .header {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: white;
    border-bottom: 1px solid #e5e7eb;

    .menu-btn {
      padding: 0.5rem;
      border-radius: 50%;
      &:hover {
        background: #f3f4f6;
      }
    }

    .logo {
      height: 2rem;
      margin-left: 0.5rem;
    }

    h1 {
      margin-left: 0.5rem;
      font-size: 1.25rem;
    }

    .search {
      flex-grow: 1;
      margin: 0 1rem;
      max-width: 42rem;
      background: #f3f4f6;
      border-radius: 9999px;
      padding: 0.5rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        background: transparent;
        width: 100%;
        &:focus {
          outline: none;
        }
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .templates-grid,
  .documents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .template,
  .document {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.25rem;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: #3b82f6;
    }

    &-preview {
      aspect-ratio: 3/4;
      background: white;
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.25rem;
      }
    }
  }

  .blank-plus {
    font-size: 2rem;
    color: #666;
  }

  .document-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h2 {
      font-size: 1rem;
    }
  }
}
</style>
