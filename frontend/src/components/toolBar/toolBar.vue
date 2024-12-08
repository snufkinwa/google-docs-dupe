<template>
  <div v-if="editor" class="editor-toolbar">
    <select v-model="selectedHeading" @change="updateHeading">
      <option value="paragraph">Normal</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
    </select>

    <div class="divider"></div>

    <div class="format-group">
      <button @click="toggleBold" :class="{ active: isBold }" title="Bold">
        <Icon name="ph:text-b-bold" />
      </button>

      <button
        @click="toggleItalic"
        :class="{ active: isItalic }"
        title="Italic"
      >
        <Icon name="ph:text-italic" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { EditorView } from "prosemirror-view";
import { toggleMark } from "prosemirror-commands";

const props = defineProps<{
  editor: EditorView;
}>();

const selectedHeading = ref("paragraph");

const isBold = computed(() => {
  if (!props.editor?.state) return false;
  const { from, $from, to, empty } = props.editor.state.selection;
  const { strong } = props.editor.state.schema.marks;

  if (empty) return strong.isInSet($from.marks());
  return props.editor.state.doc.rangeHasMark(from, to, strong);
});

const isItalic = computed(() => {
  if (!props.editor?.state) return false;
  const { from, $from, to, empty } = props.editor.state.selection;
  const { em } = props.editor.state.schema.marks;

  if (empty) return em.isInSet($from.marks());
  return props.editor.state.doc.rangeHasMark(from, to, em);
});

const toggleBold = () => {
  const { strong } = props.editor.state.schema.marks;
  toggleMark(strong)(props.editor.state, props.editor.dispatch);
};

const toggleItalic = () => {
  const { em } = props.editor.state.schema.marks;
  toggleMark(em)(props.editor.state, props.editor.dispatch);
};

const updateHeading = () => {
  // We'll implement this after fixing basic formatting
  console.log("Heading change:", selectedHeading.value);
};
</script>

<style scoped lang="scss">
.editor-toolbar {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border: 2px transparent solid;
  border-radius: 50px;
  gap: 6px;
  background-color: #f3f3f3;
  height: 36px;

  select {
    height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    background-color: white;
    border: 1px solid #dadce0;
    font-size: 14px;
  }

  .divider {
    width: 1px;
    height: 24px;
    background-color: #dadce0;
    margin: 0 4px;
  }

  .format-group {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 4px;
    border-radius: 4px;
    border: none;
    background: none;
    color: #5f6368;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.active {
      background-color: rgba(0, 0, 0, 0.1);
      color: #1a73e8;
    }

    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
