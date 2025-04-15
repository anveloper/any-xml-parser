export type XmlNode = {
  type: string;
  attr?: { [key: string]: string };
  tag?: string;
  content?: string;
  children?: XmlNode[];
};

export const createXMLParser = <const T extends readonly string[]>(tags: T) => {
  type TagValue = T[number];

  const TAGS = Object.freeze(Object.fromEntries(tags.map((tag) => [tag.toUpperCase(), tag])) as Record<Uppercase<TagValue>, TagValue>);

  const TARGET_TAGS = new Set<TagValue>(tags);

  const isTargetTag = (tag: string): tag is TagValue => {
    return TARGET_TAGS.has(tag as TagValue);
  };

  const parseAttributes = (str: string) => {
    const attrs: Record<string, string> = {};
    const attrPattern = /([a-zA-Z0-9]+)="(.*?)"/g;
    let match;
    while ((match = attrPattern.exec(str))) {
      const [, key, val] = match;
      attrs[key] = val;
    }
    return attrs;
  };

  const parseXML = (xml = "") => {
    const stack: XmlNode[] = [];
    const result: XmlNode = { type: "root", children: [] };

    let current: XmlNode = result;
    const tagPattern = /<([/!]?)\s*([a-zA-Z0-9]+)((?:\s+[a-zA-Z0-9]+\s*=\s*"[^"]*")*)\s*(\/?)>/g;
    let lastIndex = 0;

    let match;
    while ((match = tagPattern.exec(xml))) {
      const [full, closingSlash, tagName, rawAttrs, selfClosing] = match;
      const isClosing = closingSlash === "/";
      const isSelfClosing = selfClosing === "/" || full.endsWith("/>");
      const lowerTag = tagName.toLowerCase();

      if (match.index > lastIndex) {
        const text = xml.slice(lastIndex, match.index).trim();
        if (text && current) {
          if (!current.children) current.children = [];
          current.children.push({ type: "text", content: text });
        }
      }

      lastIndex = tagPattern.lastIndex;

      if (!isTargetTag(lowerTag)) continue;

      if (isClosing) {
        current = stack.pop() || { type: "none" };
        continue;
      }

      const attrs = parseAttributes(rawAttrs);
      const node = { type: "element", tag: lowerTag, attrs, children: [] };

      current.children?.push(node);

      if (!isSelfClosing) {
        stack.push(current);
        current = node;
      }
    }

    return result;
  };

  return {
    TAGS,
    TARGET_TAGS,
    isTargetTag,
    parseXML,
    parseAttributes,
    type: {
      TagValue: undefined as unknown as TagValue,
    },
  };
};
