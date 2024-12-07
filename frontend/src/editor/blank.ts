import { Buffer } from "buffer";
// @ts-ignore
globalThis.Buffer = Buffer;

import { generateId } from "@taleweaver/core/dist/tw/util/id";
import type { INode } from "@taleweaver/core/dist/tw/util/serialize";

const doc: INode = {
  componentId: "doc",
  partId: "doc",
  id: generateId(),
  text: "",
  attributes: {},
  children: [
    {
      componentId: "paragraph",
      partId: "paragraph",
      id: generateId(),
      text: "",
      attributes: {},
      children: [
        {
          componentId: "text",
          partId: "text",
          id: generateId(),
          text: "",
          attributes: {},
          children: [],
        },
      ],
    },
  ],
};

export default doc;
