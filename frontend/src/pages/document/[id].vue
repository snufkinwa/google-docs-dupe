<template>
  <topMenu />
  <toolBar v-if="editor" :editor="editor" />
  <ProseMirrorEditor
    @editorInitialized="handleEditorInitialized"
    @transactionDispatched="onTransactionDispatched"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import ProseMirrorEditor from "~/components/ProseMirrorEditor.vue";
import topMenu from "~/components/topMenu/topMenu.vue";
import toolBar from "~/components/toolBar/toolBar.vue";
import { useDocumentWebSocket } from "~/composables/useDocWebSocket";
import { Transaction, EditorState } from "prosemirror-state";

// Get the document ID from the route
const route = useRoute();
const docId = route.params.id as string;

// Track the editor instance and state
const editor = ref(null);
const editorState = ref<EditorState | null>(null);

// WebSocket functions
let connectWebSocket: (() => void) | null = null;
let updateDocument: ((tr: Transaction) => void) | null = null;

const handleEditorInitialized = (editorView: any) => {
  console.log("Editor initialized:", editorView);
  editor.value = editorView;
  editorState.value = editorView.state;

  if (editorState.value) {
    // Initialize WebSocket after the editor state is available
    const websocketHooks = useDocumentWebSocket(
      docId,
      editorState.value as EditorState
    );
    connectWebSocket = websocketHooks.connectWebSocket;
    updateDocument = websocketHooks.updateDocument;

    connectWebSocket(); // Connect WebSocket
  } else {
    console.error("EditorState is null! WebSocket will not be connected.");
  }
};

const onTransactionDispatched = (tr: Transaction) => {
  if (updateDocument) {
    console.log("Dispatched transaction:", tr);
    updateDocument(tr); // Send the transaction updates to the backend
  } else {
    console.error("WebSocket is not initialized!");
  }
};
</script>
