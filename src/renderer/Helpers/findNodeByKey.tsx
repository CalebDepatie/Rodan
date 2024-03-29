import { TreeNode } from '../Components';

export const findNodeByKey = (nodes:TreeNode[], key:string, keyName:string='id'): TreeNode|null => {  
  const path:string[]    = key.split('~');
  let node:TreeNode|null = null;

  while (path.length) {
    let list:TreeNode[] = node?.children ?? nodes;
    node = list.filter((i:TreeNode) => i.data[keyName] == path[0])[0];
    path.shift();
  }

  return node;
}
