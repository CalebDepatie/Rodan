import React, { ChangeEvent } from 'react';

import "./inputtextarea.scss";


interface InputTextAreaProps<ValueType> {
  value: ValueType;
  onChange?: (e: ChangeEvent) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
  style?: { [key: string]: string };
}

function InputTextArea<ValueType>(props: InputTextAreaProps<ValueType>) {
  return (
    <textarea
      value={props.value}
      onChange={props.onChange}
      id={props.id}
      className={props.className}
      disabled={props.disabled}
      style={props.style}
    />
  );
}

InputTextArea.defaultProps = {
  disabled: false,
  value: '',
  className: 'r-inputtextarea'
};

export default InputTextArea;
