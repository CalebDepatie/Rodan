import React from 'react';

import "./card.scss";

export function Card(props: {children?: React.ReactNode}) {

  return <>
    <div className="r-card">
      {props.children}
    </div>
  </>
}
