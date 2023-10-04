import React, { ChangeEvent } from 'react';

import "./inputtext.scss";

interface InputTextProps<ValueType> {
  value: ValueType;
  onChange?: (e: ChangeEvent) => void;
  type?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  style?: { [key: string]: string };
}

function InputText<ValueType>(props: InputTextProps<ValueType>) {
  return (
    <input
      value={props.value}
      type={props.type}
      onChange={props.onChange}
      id={props.id}
      className={props.className}
      disabled={props.disabled}
      style={props.style}
    />
  );
}

InputText.defaultProps = {
  disabled: false,
  type: 'text',
  value: '',
  className: 'r-inputtext'
};

export default InputText;
