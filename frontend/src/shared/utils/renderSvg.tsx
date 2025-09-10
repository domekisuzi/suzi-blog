 
import React from 'react';
import { SvgNode } from './parseSvgToJson';

export const renderSvgNode = (node: SvgNode): JSX.Element => {
  const { tag, attrs, children } = node;
    const svgNode:JSX.Element = React.createElement(
                tag,
                { ...attrs, key: Math.random().toString() }, // key 可优化
                children?.map(renderSvgNode)
            );
    // console.log("this node is ",svgNode)
  return  svgNode
};