import React, { MouseEvent, ReactNode } from 'react';

import './button.scss';

interface ButtonProps {
  id?: string;
  label?: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
  types?: string;
  onClick?: (e: MouseEvent) => void;
  style?: { [key: string]: string };
  children?: ReactNode;
}

function Button(props: ButtonProps) {

  const label = props.label ? <span>{props.label}</span> : null;
  const icon  = props.icon ? <span className={props.icon} /> : null;

  return (
    <button id={props.id} type={props.type} className={props.className} disabled={props.disabled} onClick={props.onClick} style={props.style}>
      {icon}
      {label}
      {props.children}
    </button>
  );
};

Button.defaultProps = {
  disabled: false,
  className: 'r-button-primary',
  type: 'button'
}

export default Button;
