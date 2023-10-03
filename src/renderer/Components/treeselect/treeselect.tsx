import React, { ReactNode } from 'react';

import './treeselect.scss';

import { TreeNode } from '../core';

function TreeSelect(props:{id?:string, label?:string, className?:string,
	options:TreeNode[], value:string, onChange?:(e:any)=>void,
	style?:{[key:string]: string}, children?:ReactNode}) {

	const className = props.className ?? 'r-treeselect';

	const renderOptions = (options) => {
    return options.map((option) => {
      const indent = ' '.repeat(option.level * 2);

      return (
        <option key={option.key} value={option.key}>
          {indent}
          {option.label}
        </option>
      );
    });
  };

	function flattenOptions(options: TreeNode[], level = 0) {
		let flattenedOptions = [];
	
		options.forEach((option) => {
			let label = option.label;

			if (level > 0) {
				label = '--'.repeat(level * 1) + '> ' + label;
			}

			let new_option = {
				label: label,
				key: option.key,
				level: level,
			}

			flattenedOptions.push(new_option);
	
			if (option.children && option.children.length > 0) {
				flattenedOptions = flattenedOptions.concat(
					flattenOptions(option.children, level + 1)
				);
			}
		});
	
		return flattenedOptions;
	}

  const flattenedOptions = flattenOptions(props.options);

	return (
		<select id={props.id} className={className}
			value={props.value} onChange={props.onChange} style={props.style}>
			{renderOptions(flattenedOptions)}
		</select>
	);
};

TreeSelect.defaultProps = {
  
}

export default TreeSelect;
