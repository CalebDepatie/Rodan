// This file describes types that are used by the components

export type Identifier = string | number;

export interface TreeNode {
		label:string;
		key:string | number;
		data:any;
		children:TreeNode[];
}


