import React, { useRef, useState, useEffect } from 'react';

import { usePopper } from 'react-popper'

import './tooltip.scss';

function Tooltip(props:{id?:string, content:any,
    children:any, className?:string, arrowClassName?:string, style?:{[key:string]: string}}) {

  const refElement    = useRef<any>(null);
  const popperElement = useRef<any>(null);
  const [arrowRef, setArrowRef] = useState<any>(null);
  const { styles, attributes }  = usePopper(refElement?.current, popperElement?.current,
    {modifiers: [{ name:"arrow", options:{element:arrowRef} },
                { name:"offset", options:{offset:[0,8]}}]});

  const show = () => {
    popperElement?.current?.setAttribute('data-show', '');
  }

  const hide = () => {
    popperElement?.current?.removeAttribute('data-show');
  }

  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  useEffect(() => {
    showEvents.forEach((event) => {
      refElement?.current?.addEventListener?.(event, show);
    });

    hideEvents.forEach((event) => {
      refElement?.current?.addEventListener?.(event, hide);
    });

    // return cleanup fucntion
    return () => {
      showEvents.forEach((event) => {
        refElement?.current?.removeEventListener?.(event, show);
      });

      hideEvents.forEach((event) => {
        refElement?.current?.removeEventListener?.(event, hide);
      });
    }
  }, []);

  return (
    <>
    <div ref={refElement}>
     {props.children}
    </div>

    <div ref={popperElement} style={{...styles.popper, ...props.style}}
      className={props.className} {...attributes.popper}>
      {props.content}

      <div ref={setArrowRef} style={styles.arrow}
        className={props.arrowClassName} data-popper-arrow />

    </div>
    </>
  );
};

Tooltip.defaultProps = {
  className: 'r-tooltip',
  arrowClassName: 'r-arrow',
  style: {},
};

export default Tooltip
