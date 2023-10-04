import React, { ReactNode } from 'react';

import "./list.scss"

import { Identifier } from '../core';
import ListItem from './listitem';

interface ListProps {
	id?: string;
	className?: string;
	optionValue: Identifier;
	optionLabel: Identifier;
	optionGroupLabel: Identifier;
	optionGroupChildren: Identifier;
	value: any[];
	onChange?: (e: any) => void;
	selectionKeys?: (Identifier[] | Identifier);
	style?: { [key: string]: string };
	children?: ReactNode;
}

function List(props: ListProps) {

	const handleChange = (itm:Identifier) => {
		return (evt:any) => {
			if (props.onChange) {
				props.onChange({...evt, value:itm})
			}
		}
	}

	return <div className={props.className} style={props.style} >
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
  className: "r-list"
}

export default List;
