<template>
  <topMenu />
  <toolBar v-if="editor" :editor="editor" />
  <ProseMirrorEditor @editorInitialized="handleEditorInitialized" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ProseMirrorEditor from "~/components/ProseMirrorEditor.vue";
import topMenu from "~/components/topMenu/topMenu.vue";
import toolBar from "~/components/toolBar/toolBar.vue";
import { useDocumentWebSocket } from "~/composables/useDocWebSocket";

const route = useRoute();
const editor = ref(null);

const { connectWebSocket } = useDocumentWebSocket(route.params.id);

onMounted(() => {
  connectWebSocket();
});

const handleEditorInitialized = (editorView) => {
  console.log("Editor initialized:", editorView);
  editor.value = editorView;
};
</script>
