<script setup>
import { ref } from "vue";
import docSidebar from "~/components/docSidebar.vue";
import { useRouter, useRoute } from "vue-router"; // Import useRouter and useRoute
import { v4 as uuidv4 } from "uuid";

const router = useRouter();
const route = useRoute(); // Initialize useRoute to access route params

// Access the dynamic document ID (if applicable)
const documentId = route.params.id; // This works only if you're in a dynamic route (e.g., /documents/:id)

//const { data: documents } = await useFetch("/api/documents");
const { user } = useUser();

// Sidebar visibility state
const isSidebarVisible = ref(false);

// Toggle sidebar
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const templates = [
  { name: "Blank document", type: "blank" },
  { name: "Resume", type: "Coral", preview: "image/Resume.png" },
  { name: "Letter", type: "Spearmint", preview: "/image/Letter.png" },
  {
    name: "Project proposal",
    type: "Tropic",
    preview: "/image/Project.png",
  },
  { name: "Report", type: "Luxe", preview: "/image/Report.png" },
];

const createDocument = async (template) => {
  try {
    // Generate a UUID for the document
    const id = uuidv4();

    // Redirect to the new document page with the generated ID
    router.push(`/document/${id}`); // Navigate to /documents/:id
    return;
  } catch (error) {
    console.error("Failed to create document:", error);
  }
};
</script>

<template>
  <div class="documents">
    <!-- Sidebar -->
    <transition name="slide">
      <docSidebar v-show="isSidebarVisible" />
    </transition>

    <!-- Header -->
    <header class="header">
      <div class="right-section">
        <button class="menu-btn" @click="toggleSidebar">
          <Icon name="ic:baseline-menu" size="2em" />
        </button>
        <div class="logo-section">
          <img src="/images/DOCUVY.svg" alt="Docuvy" class="logo" />
          <h1>Docuvy</h1>
        </div>
      </div>

      <div class="search">
        <Icon name="ic:baseline-search" size="1.75em" />
        <input type="text" placeholder="Search" />
      </div>

      <div class="header-actions">
        <button class="grid-btn">
          <Icon name="ic:baseline-apps" size="2em" />
        </button>
        <UserButton />
      </div>
    </header>

    <main class="main-content">
      <div class="new-document">
        <div class="section-header">
          <h2>Start a new document</h2>
          <div class="header-buttons">
            <button class="template-btn">Template gallery</button>
            <button class="more-btn">
              <Icon name="ic:baseline-more-vert" size="1.5em" />
            </button>
          </div>
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
                <div class="blank-plus">
                  <Icon name="ic:baseline-add" class="plus-icon" />
                </div>
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
        <div class="section-header">
          <h2>Recent documents</h2>
          <div class="view-controls">
            <select>
              <option>Owned by anyone</option>
            </select>
            <div class="view-buttons">
              <button>
                <Icon name="ic:twotone-view-list" size="1.5em" />
              </button>
              <button>
                <Icon name="ic:twotone-sort-by-alpha" size="1.5em" />
              </button>
              <button>
                <Icon name="ic:baseline-folder-open" size="1.5em" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="documents?.length" class="documents-grid">
          <NuxtLink
            v-for="doc in documents"
            :key="doc.id"
            :to="`/documents/${doc.id}`"
            class="document"
          >
            <div class="document-preview">
              <img
                :src="doc.preview || '/api/placeholder/160/220'"
                :alt="doc.name"
              />
            </div>
            <div class="document-info">
              <p class="document-name">{{ doc.name }}</p>
              <div class="document-meta">
                <Icon name="heroicons:document" size="16" />
                <span>{{ new Date(doc.updated_at).toLocaleDateString() }}</span>
                <button class="more-btn">
                  <Icon name="heroicons:ellipsis-vertical" />
                </button>
              </div>
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
button {
  border: none;
  padding: 0;
  background-color: transparent;
}

.documents {
  min-height: 100vh;
  background: white;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    gap: 1rem;

    .right-section {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .menu-btn {
      padding: 0.5rem;
      border-radius: 50%;
      &:hover {
        background: #f3f4f6;
      }
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .logo {
        height: 2.5rem;
      }

      h1 {
        font-size: 1.5rem;
        font-weight: 500;
        color: #5f6368;
      }
    }

    .search {
      flex-grow: 1;
      max-width: 600px;
      background: #f1f3f4;
      border-radius: 24px;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        border: none;
        background: transparent;
        width: 100%;
        font-size: 1rem;
        &:focus {
          outline: none;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;

      button {
        padding: 0.5rem;
        border-radius: 50%;
        &:hover {
          background: #f3f4f6;
        }
      }
    }
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 300px;
    background: #ffffff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    &.hidden {
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
    }

    &.visible {
      transform: translateX(0);
      transition: transform 0.3s ease-in-out;
    }

    .slide-enter-active,
    .slide-leave-active {
      transition: transform 0.3s ease;
    }
    .slide-enter-from,
    .slide-leave-to {
      transform: translateX(-100%);
    }
    .slide-enter-to,
    .slide-leave-from {
      transform: translateX(0);
    }
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .new-document {
    background-color: #f3f4f6;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    padding: 2rem calc(50vw - 50% + 1.5rem);
  }

  .recent-documents {
    padding-top: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h2 {
      font-size: 1rem;
      color: #666;
    }

    .header-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .view-controls {
      display: flex;
      gap: 1rem;
      align-items: center;

      select {
        appearance: none;
        background: url("data:image/svg+xml;utf8,<svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path fill='%235F6368' d='m7 10l5 5l5-5z'/></svg>")
          no-repeat;
        background-position: right 8px center;
        background-position-x: 100%;
        background-position-y: 50%;
        padding: 8px 32px 8px 12px;
        border: 1px solid transparent;
        border-radius: 4px;
        color: #5f6368;
        font: inherit;
        cursor: pointer;
      }

      .view-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.25rem;

        button {
          padding: 0.5rem;
          border-radius: 0.25rem;
          &:hover {
            background: #f3f4f6;
          }
        }
      }
    }
  }

  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .template {
    cursor: pointer;

    &-preview {
      aspect-ratio: 3/4;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: border-color 0.2s;

      &:hover {
        border-color: #1a73e8;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-info {
      margin-top: 0.5rem;
      text-align: center;
    }

    &-name {
      font-weight: 500;
    }

    &-type {
      color: #666;
      font-size: 0.875rem;
    }
  }

  .blank-plus {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .plus-icon {
      width: 3em;
      height: 3em;
      color: #1a73e8;
    }
  }

  .documents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

  .document {
    text-decoration: none;
    color: inherit;

    &-preview {
      aspect-ratio: 3/4;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: border-color 0.2s;

      &:hover {
        border-color: #1a73e8;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-info {
      margin-top: 0.5rem;
    }

    &-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    &-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }
  }

  .more-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.25rem;
    border-radius: 50%;
    &:hover {
      background: #f3f4f6;
    }
  }
}
</style>
