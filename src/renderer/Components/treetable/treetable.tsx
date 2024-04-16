import React, { ReactNode, useState } from 'react';

import './treetable.scss';

import { Identifier, TreeNode, Ledger, Button } from '../';
import { Column } from '../table/table';
import Row from '../table/row';
import Cell from '../table/cell';
import { relative } from 'path';


interface ExpandedableRowProps {
	value: TreeNode;
	columns: Column[];
	selectionKey?: Identifier;
	onSelectionChange?: (e: any) => void;
	width: string;
	level?: number;
}

function ExpandedableRow(props: ExpandedableRowProps) {
	
	const [expanded, setExpanded] = useState(false);
	const buttonIcon = expanded ? "fa fa-angle-down" : "fa fa-angle-right"

	return (<div className={"r-treetable-group" + (expanded ? " expanded" : "")}>
		<Row className={props.selectionKey === props.value.key ? "r-treetable-selected" : ""} key={props.value.key} 
			onClick={(evt) => props.onSelectionChange?.({...evt, value: props.value.key})}>
			
			{props.columns.map((col:Column, idx:number) => {
				let body = (col.body != undefined) ? <col.body {...props.value} />
											: props.value.data?.[col.field]

				const isExpander = idx === 0 && props.value.children?.length > 0;

				const padding = (props.level??0)*30 + "px"
				const width = isExpander ? `calc(${props.width} - 24px)` : props.width

				let ret = [
					<Cell key={props.value.key + "-" + col.field}
						style={{width: width, paddingLeft:padding, ...col.style}}
						editor={(col.editor != undefined) ? () => <col.editor {...props.value} kkey={props.value.key} /> : undefined}>

						{body}
					</Cell>
				]
				
				if (isExpander) {
					ret = [
						<Button icon={buttonIcon} onClick={() => setExpanded(curState => !curState)}
							style={{background:"transparent", color:"black"}}/>,
						...ret
					]
				}

				return ret
			}
			)}
		</Row>
		{expanded && props.value.children?.map((child:TreeNode) => {
			return <ExpandedableRow key={child.key} width={props.width} level={(props.level || 0) + 1}
				value={child} columns={props.columns} onSelectionChange={props.onSelectionChange}
				selectionKey={props.selectionKey} />
			}
		)}
	</div>)
}

interface TreeTableProps {
	id?: string;
	className?: string;
	value: TreeNode[];
	columns: Column[];
	header: any;
	selectionKey?: Identifier;
	onSelectionChange?: (e: any) => void;
	style?: { [key: string]: string };
	children?: ReactNode;
}

function TreeTable(props: TreeTableProps) {
	
	const equalPercent = (100 / props.columns.length) + "%";

	return (
		<div className={props.className} style={props.style}>
			<div className="r-table-top">{props.header}</div>

			<Ledger columns={props.columns.map((col:Column) => col.header)}>
        {
          props.value.map((row) => {
            return  <>
				<ExpandedableRow key={row.key} width={equalPercent} onSelectionChange={props.onSelectionChange}
							selectionKey={props.selectionKey}
							value={row} columns={props.columns} />
				<div className='r-table-fill' />
				</>
			}
          )}
      </Ledger>
		</div>
	)
};

TreeTable.defaultProps = {
  className: 'r-treetable',
}

export default TreeTable;
