<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { useWebSocket } from "@/composables/useWebSocket";

const { docContent, updateDocument } = useWebSocket("ws://localhost:8080/ws");
const quillEditor = ref<Quill | null>(null);
const editorRef = ref<HTMLElement | null>(null);
const documentTitle = ref("Untitled document");

onMounted(() => {
  if (editorRef.value) {
    quillEditor.value = new Quill(editorRef.value, {
      modules: {
        toolbar: "#toolbar",
      },
      theme: "snow",
    });

    quillEditor.value.on("text-change", () => {
      const content = quillEditor.value?.getContents();
      if (content) {
        updateDocument(JSON.stringify(content));
      }
    });

    if (docContent.value) {
      try {
        quillEditor.value.setContents(JSON.parse(docContent.value));
      } catch (e) {
        console.error("Failed to parse initial content:", e);
      }
    }
  }
});
</script>

<template>
  <div class="main-container">
    <!-- Top Menu Bar -->
    <div class="top-menu">
      <div class="title-section">
        <img src="../assets/docs.png" alt="Logo" class="logo" />
        <div class="title-menu">
          <input v-model="documentTitle" class="document-title" type="text" />
          <div class="menu-bar">
            <button>File</button>
            <button>Edit</button>
            <button>View</button>
            <button>Insert</button>
            <button>Format</button>
            <button>Tools</button>
            <button>Add-ons</button>
            <button>Help</button>
          </div>
        </div>
      </div>
      <button class="share-button">Share</button>
    </div>

    <!-- Formatting Toolbar -->
    <div id="toolbar" class="formatting-toolbar">
      <select class="ql-header">
        <option value="">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
      </select>
      <select class="ql-font">
        <option value="sans-serif" selected>Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
      <select class="ql-color"></select>
      <select class="ql-background"></select>
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <select class="ql-align"></select>
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
    </div>

    <!-- Editor Container -->
    <div class="editor-wrapper">
      <div class="document-container">
        <div ref="editorRef"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  height: 97vh;
  display: flex;
  flex-direction: column;
}

.top-menu {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4px 8px;
  background-color: white;
  height: 68px;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.title-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-bar {
  display: flex;
  gap: 4px;
}

.menu-bar button {
  padding: 4px 8px;
  border: none;
  background: none;
  font-size: 14px;
  color: #5f6368;
  border-radius: 4px;
}

.menu-bar button:hover {
  background-color: #f1f3f4;
}

.formatting-toolbar {
  display: flex;
  align-items: center;
  gap: 80px;
  padding: 4px 8px;
  height: 46px;
}

.editor-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  margin-top: 10px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
}

.document-container {
  width: 850px;
  background: white;
  min-height: 1100px;
  padding: 72px 96px; /* Adjusted padding to match Google Docs */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  margin-top: 20px; /* Added margin to match screenshot */
}

.document-title {
  font-size: 18px;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 2px;
}

.document-title:hover {
  background-color: #f1f3f4;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 8px;
}

.share-button {
  background-color: #c2e7ff;
  color: #001d35;
  border: none;
  padding: 8px 24px;
  border-radius: 20px; /* More rounded corners */
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.share-button:hover {
  background-color: #b3d7ee;
}

:deep(.ql-container) {
  border: none;
  font-family: "Google Sans", Arial, sans-serif;
  font-size: 11pt;
}

:deep(.ql-editor) {
  padding: 0;
  line-height: 1.5;
  min-height: 1100px;
}

:deep(.ql-editor strong) {
  font-weight: bold;
}

:deep(.ql-toolbar.ql-snow) {
  display: flex;
  align-items: center;
  padding: 4px 8px 4px;
  border: 2px transparent solid;
  border-radius: 50px;
  gap: 6px;
  background-color: #f3f3f3;
  height: 36px;
}
</style>
