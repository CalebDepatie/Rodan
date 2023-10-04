import React, { ReactNode } from 'react';
import { Identifier } from '../core';

interface ListItemProps {
	id?: string;
	label: string;
	key: Identifier;
	selected: boolean;
	setSelected: (e: any) => void;
	className?: string;
	children?: ReactNode;
}

function ListItem(props: ListItemProps) {

	return <>
		<div id={props.id} key={props.key} className={props.className}>
			<div className={props.selected ? "selected" : ""} onClick={props.setSelected}>
				{props.label}
			</div>
		</div>
	</>
}

ListItem.defaultProps = {
	className: "r-list-item"
}

export default ListItem;
