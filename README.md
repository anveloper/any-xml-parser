# 🧹 any-xml-parser

A lightweight and fully type-safe XML parser factory for custom-tagged XML formats like CUSTOM_ML.  
Allows you to define your own valid tag set, parse the XML into a tree structure, and perform tag-safe type filtering.

---

## 🚀 Installation

```bash
npm install any-xml-parser
```

Or with Yarn:

```bash
yarn add any-xml-parser
```

---

## ✨ Features

- 🍿 User-defined tag set (no hardcoded `<div>`, `<body>` nonsense)
- 🔒 Type-safe tag filtering with `isTargetTag`
- 📦 Fully self-contained (no dependencies)
- 🫖 Ideal for design tools, rich XML formats, and offline parsing

---

## 🔧 Usage

### 1. Define your valid tags and create a parser

```ts
import { createXMLParser } from "any-xml-parser";

const parser = createXMLParser(["anyml", "page", "backgroundimage", "textbox", "picturebox"] as const);
```

---

### 2. Parse your custom XML string

```ts
const xml = `
  <anyml>
    <page name="cover">
      <textbox text="Hello, world!" />
    </page>
  </anyml>
`;

const result = parser.parseXML(xml);
console.dir(result, { depth: null });
```

---

### 3. Use type-safe utilities

```ts
if (parser.isTargetTag("page")) {
  // ✅ type is narrowed to "anyml" | "page" | ...
}

console.log(parser.TAGS.PAGE); // → "page"
console.log(parser.TARGET_TAGS.has("textbox")); // true
```

---

## 🧬 Types

```ts
type XmlNode = {
  type: "root" | "element" | "text";
  attr?: { [key: string]: string };
  tag?: string;
  content?: string;
  children?: XmlNode[];
};

type TagValue = typeof parser.type.TagValue; // "anyml" | "page" | ...
```

---

## 🧐 Advanced Use Case: Global Parser Instance

You can create and export a parser instance:

```ts
// xml-parser.ts
export const xmlParser = createXMLParser([...yourTags] as const);
export type TagValue = typeof xmlParser.type.TagValue;
```

Then use it globally:

```ts
import { xmlParser } from "./xml-parser";
xmlParser.parseXML(...);
```

---

## 🧼 License

MIT © 2025 anveloper
