<template>
  <topMenu />
  <toolBar v-if="editor" :editor="editor" />
  <ProseMirrorEditor @editorInitialized="handleEditorInitialized" />
</template>

<script setup>
import { ref } from "vue";
import ProseMirrorEditor from "~/components/ProseMirrorEditor.vue";
import topMenu from "~/components/topMenu/topMenu.vue";
import toolBar from "~/components/toolBar/toolBar.vue";

const editor = ref(null);

const handleEditorInitialized = (editorView) => {
  console.log("Editor initialized:", editorView);
  editor.value = editorView;
};
</script>
