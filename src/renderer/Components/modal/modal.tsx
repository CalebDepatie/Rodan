import React from 'react';

import { usePopper } from 'react-popper'

import './modal.scss';

function Modal(props:{id?:string, header?:any, visible:boolean, onHide:any,
    footer?:any, children?:any, className?:string, style?:{[key:string]: string}}) {



  return (
    <div>

    </div>
  );
};

Modal.defaultProps = {

};

export default Modal
