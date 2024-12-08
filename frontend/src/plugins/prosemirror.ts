import { Schema } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { history } from "prosemirror-history";

const schema = new Schema({
  nodes: {
    doc: {
      content: "block+",
    },
    paragraph: {
      group: "block",
      content: "inline*",
      toDOM() {
        return ["p", 0];
      },
      parseDOM: [{ tag: "p" }],
    },
    text: {
      group: "inline",
    },
  },
  marks: {
    strong: {
      toDOM() {
        return ["strong", 0];
      },
      parseDOM: [{ tag: "strong" }, { tag: "b" }],
    },
    em: {
      toDOM() {
        return ["em", 0];
      },
      parseDOM: [{ tag: "em" }, { tag: "i" }],
    },
  },
});

const buildKeymap = (schema: Schema) => {
  let keys: { [key: string]: any } = {};
  keys["Mod-b"] = toggleMark(schema.marks.strong);
  keys["Mod-i"] = toggleMark(schema.marks.em);
  return keys;
};

export default defineNuxtPlugin(() => {
  function createEditor(element: HTMLElement) {
    const state = EditorState.create({
      doc: schema.node("doc", null, [
        schema.node("paragraph", null, [schema.text("Start typing here...")]),
      ]),
      schema,
      plugins: [history(), keymap(buildKeymap(schema)), keymap(baseKeymap)],
    });

    return new EditorView(element, {
      state,
      dispatchTransaction(this: EditorView, tr: Transaction) {
        const newState = this.state.apply(tr);
        this.updateState(newState);
      },
    });
  }

  return {
    provide: {
      createEditor,
    },
  };
});
