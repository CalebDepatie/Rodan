import React from 'react'

import "./card.scss"

export function Card(props: {title?:string, width?:string, height?:string, children?: React.ReactNode}) {

  const content_height = props.title ? "90%" : "100%"

  return <>
    <div className="r-card" style={{width:props.width, height:props.height}}>
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
