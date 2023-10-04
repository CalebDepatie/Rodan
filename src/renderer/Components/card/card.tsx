import React, { ReactNode } from 'react'

import "./card.scss"

interface CardProps {
  title?: string;
  width?: string;
  height?: string;
  style: { [key: string]: string };
  children?: ReactNode;
}

export function Card(props: CardProps) {

  const content_height = props.title ? "90%" : "100%"

  return <>
    <div className="r-card" style={{...props.style, width:props.width, height:props.height}}>
      <div className="r-title">
        {props.title}
      </div>

      <div className="r-content" style={{height:content_height}}>
        {props.children}
      </div>
    </div>
  </>
}

Card.defaultProps = {
  width: "250px",
  height: "250px",
}
