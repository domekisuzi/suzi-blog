// A file to parse Svg file when it can work well


export interface SvgNode {
  tag: string;
  attrs: Record<string, string>;
  children?: SvgNode[];
}

export const parseSvgToJson = (svgString: string): SvgNode | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const root = doc.documentElement;

  const parseElement = (el: Element): SvgNode => {
    const attrs: Record<string, string> = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      attrs[attr.name] = attr.value;
    }

    const children: SvgNode[] = [];
    el.childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        children.push(parseElement(node as Element));
      }
    });

    return {
      tag: el.tagName,
      attrs,
      children: children.length ? children : undefined
    };
  };

  const res =   parseElement(root)
//   console.log("解析为json为",res)
  return res;
};
