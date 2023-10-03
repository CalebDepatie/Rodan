import React, { ReactNode, useState } from 'react';

import "./treelist.scss"

import { TreeNode, Identifier } from '../core';
import { Button } from '../';

function TreeListItem(props:{id?:string, value:TreeNode, selected:boolean,
	setSelected:(e:any)=>void, level?:number, className?:string, children?:ReactNode
	}) {
	const [expanded, setExpanded] = useState(false);

	const buttonIcon = expanded ? "fa fa-angle-down" : "fa fa-angle-right"

	const handleClick = () => {
		setExpanded(curState => !curState)
	}

	const label = <>
		<div className='r-treelist-item' style={{paddingLeft: `${(props.level || 0) * 20}px`}}>
			{props.children && <Button icon={buttonIcon} onClick={handleClick} />}
			<div className={props.selected ? "selected" : ""} onClick={props.setSelected}>
				<span className={"r-treelist-icon " + props.value.icon} />
				{props.value.label}
			</div>
		</div>
	</>

	return <div key={props.value.key} className={props.className}>
		{label}
		{(props.children && expanded) && (
			<div className="r-treelist-group">
				{props.children}
			</div>
		)}
	</div>
}

function TreeList(props:{id?:string, className?:string,
	value:TreeNode[], onChange?:(e:any)=>void, selectionKeys?:Identifier[] | Identifier,
	style?:{[key:string]: string}, children?:ReactNode}) {

	const className = props.className ?? "r-treelist"

	const handleChange = (itm:Identifier) => {
		return (evt:any) => {
			if (props.onChange) {
				props.onChange({...evt, value:itm})
			}
		}
	}

	const renderNode = (level:number) => {
		return (node:TreeNode) => {
			const isSelected = props.selectionKeys?.includes(node.key) ?? false
			const hasChildren = node.children && node.children.length > 0

			return <TreeListItem value={node} setSelected={handleChange(node.key)} 
				selected={isSelected} level={level}>
				{hasChildren && node.children?.map(renderNode(level+1))}
			</ TreeListItem>
		}
	}

	return <div className={className} style={props.style} >
		{props.value.map(renderNode(0))}
	</div>;
}

TreeList.defaultProps = {
  
}

export default TreeList;
