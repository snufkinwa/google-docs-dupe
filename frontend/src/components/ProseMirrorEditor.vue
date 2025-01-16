<template>
  <div class="editor-wrapper">
    <div class="editor-section" ref="editorRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineEmits } from "vue";
import { EditorView } from "prosemirror-view";
import { Transaction } from "prosemirror-state";

const editorRef = ref<HTMLElement | null>(null);
const editorView = ref<EditorView | null>(null);
const { $createEditor } = useNuxtApp();

const emit = defineEmits(["editorInitialized", "transactionDispatched"]);

// Transaction dispatch logic
const dispatchTransaction = function (this: EditorView, tr: Transaction): void {
  if (editorView.value) {
    const newState = editorView.value.state.apply(tr);
    editorView.value.updateState(newState);

    // Emit the transaction so the parent component can handle updates
    emit("transactionDispatched", tr);
  }
};

onMounted(() => {
  if (editorRef.value) {
    // Pass the dispatchTransaction function to the plugin
    editorView.value = $createEditor(editorRef.value, dispatchTransaction);

    if (editorView.value) {
      console.log("Editor instance created:", editorView.value);
      emit("editorInitialized", editorView.value);
    }
  }
});

onBeforeUnmount(() => {
  if (editorView.value) {
    editorView.value.destroy();
  }
});
</script>

<style lang="scss">
.editor-wrapper {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 30px;

  .editor-section {
    width: 850px;
    min-height: 1100px;
    margin: 0 auto;
    background: white;
    padding: 72px 96px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

    .ProseMirror {
      outline: none;

      p {
        margin: 0 0 1em 0;
        line-height: 1.5;
      }

      /* Pagination styles */
      .page {
        margin-bottom: 2rem;
        border: 1px solid #e0e0e0;
        padding: 1rem;
        background: #fff;
      }

      .page-header,
      .page-footer {
        background: #f1f1f1;
        padding: 0.5rem;
        text-align: center;
      }

      .page-body {
        min-height: 900px;
        padding: 1rem;
      }
    }
  }
}
</style>
