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
          text: "Your Name",
          attributes: { size: 28, weight: 700 },
          children: [],
        },
      ],
    },
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
          text: "Software Engineer | email@example.com | (555) 555-5555",
          attributes: { size: 16, color: "rgba(100, 100, 100, 1)" },
          children: [],
        },
      ],
    },
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
          text: "Experience",
          attributes: { size: 20, weight: 700 },
          children: [],
        },
      ],
    },
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
          text: "Senior Developer, Tech Corp (2020-Present)",
          attributes: { weight: 700 },
          children: [],
        },
      ],
    },
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
          text: "• Led development of core platform features • Managed team of 5 junior developers • Reduced system latency by 40%",
          attributes: {},
          children: [],
        },
      ],
    },
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
          text: "Education",
          attributes: { size: 20, weight: 700 },
          children: [],
        },
      ],
    },
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
          text: "BS Computer Science, University Name (2016-2020)",
          attributes: { weight: 700 },
          children: [],
        },
      ],
    },
  ],
};

export default doc;
