// This file describes types that are used by the components

export type Identifier = string | number;

export class TreeNode {
		label:string;
		key:string | number;
		data:any;
		children:TreeNode[];

		constructor(label:string, key:string | number, children:TreeNode[]) {
			this.label = label;
			this.key = key;
			this.children = children;
		}
	}


