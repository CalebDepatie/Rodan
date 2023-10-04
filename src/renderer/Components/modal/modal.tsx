import React, { useRef, useEffect } from 'react';

import './modal.scss';

import { Button } from '../';

interface ModalProps {
  id?: string;
  header?: any;
  visible: boolean;
  onHide: any;
  footer?: any;
  children?: any;
  className?: string;
  style?: { [key: string]: string };
}

function Modal(props: ModalProps) {

  const dialog_ref = useRef(null);

  const handleClose = () => {
    props.onHide();
    dialog_ref.current?.close();
  }

  useEffect(() => {
    if (dialog_ref.current) {
      dialog_ref.current.addEventListener('close', handleClose);
    }

  }, [dialog_ref.current])

  useEffect(() => {
    if (props.visible)
      dialog_ref.current?.showModal();

  }, [props.visible])

  const className = props.className ?? "r-modal";

  return (
    <dialog id={props.id} ref={dialog_ref} className={className} style={props.style}>
      <div className="modal-header">
        {props.header}
        <Button icon="fa fa-x" onClick={handleClose} style={{float: 'right'}} />
      </div>
      <hr />
      <div className="r-modal-body">
        {props.children}
      </div>
      <hr />
      <div className="r-modal-footer">
        {props.footer}
      </div>
    </dialog>
  );
};

Modal.defaultProps = {

};

export default Modal
