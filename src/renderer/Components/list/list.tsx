import React, { ReactNode, useState } from 'react';

import "./list.scss"

import { TreeNode, Identifier } from '../core';
import { Button } from '..';

function ListItem(props:{id?:string, label:string, key:Identifier, selected:boolean,
	setSelected:(e:any)=>void, className?:string, children?:ReactNode
	}) {

	const className = props.className ?? "r-list-item"

	return <>
		<div id={props.id} key={props.key} className={className}>
			<div className={props.selected ? "selected" : ""} onClick={props.setSelected}>
				{props.label}
			</div>
		</div>
	</>
}

function List(props:{id?:string, className?:string, 
	optionValue:Identifier, optionLabel:Identifier, optionGroupLabel:Identifier, optionGroupChildren:Identifier,
	value:any[], onChange?:(e:any)=>void, selectionKeys?:Identifier[] | Identifier,
	style?:{[key:string]: string}, children?:ReactNode}) {

	const className = props.className ?? "r-list"

	const handleChange = (itm:Identifier) => {
		return (evt:any) => {
			if (props.onChange) {
				props.onChange({...evt, value:itm})
			}
		}
	}

	return <div className={className} style={props.style} >
		{props.value.map((itm:any) => <>
			<div className='r-list-header'>
				<span className={itm.icon} />
				{itm[props.optionGroupLabel]}
			</div>

			{itm[props.optionGroupChildren].map((itm:any) => {
				const isSelected = props.selectionKeys?.includes(itm[props.optionValue]) ?? false
				return <ListItem label={itm[props.optionLabel]} key={itm[props.optionValue]}
					selected={isSelected} setSelected={handleChange(itm[props.optionValue])}  />
				}
			)}
		</>)}
	</div>
}

List.defaultProps = {
  
}

export default List;
