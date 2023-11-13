import React from "react";

import "./boxoptions.scss"

interface LabelBox {
    value: string;
    label: string;
}

interface BoxProps {
    labelBox: LabelBox;
    active: boolean;
}

interface BoxOptionsProps {
    value: string;
    labels: LabelBox[];
}

function Box(props: BoxProps) {
    const className = "r-boxoption" +
        (props.active ? " active" : " inactive")

    return <div className={className} key={props.labelBox.value}>
        {props.labelBox.label}
    </div>
}

function BoxOptions(props: BoxOptionsProps) {
    const boxes = props.labels.map((label, index) => 
        {
            const isActive = label.value === props.value;
            const box = Box({labelBox:label, active:isActive});
            const arrow = index < props.labels.length - 1 ? <span className="r-box-arrow fa fa-arrow-right" /> : null;

            return [box, arrow];
        }).flat();

    return <div className="r-boxoptions">
        {boxes}
    </div>
}

export default BoxOptions