import React from "react";

import "./boxoptions.scss"
import { monitorEventLoopDelay } from "perf_hooks";

interface LabelBox {
    value: string;
    label: string;
}

interface BoxProps {
    labelBox: LabelBox;
    active: boolean;
    onClick?: (evt: React.MouseEvent) => void;
}

function Box(props: BoxProps) {
    const className = "r-boxoption" +
        (props.active ? " active" : " inactive")

    const onClick = (evt: React.MouseEvent) => {
        evt.target.value = props.labelBox.value

        props.onClick?.(evt)
    }

    return <div className={className} key={props.labelBox.value} onClick={onClick}>
        {props.labelBox.label}
    </div>
}

interface BoxOptionsProps {
    labels: LabelBox[];
    value?: string;
    onClick?: (evt: React.MouseEvent) => void;
}

function BoxOptions(props: BoxOptionsProps) {

    const boxes = props.labels.map((label, index) => 
        {
            const isActive = label.value === props.value
            const box = <Box key={"box-" + label.value} onClick={props.onClick}
                            labelBox={label} active={isActive} />
            const arrow = index < props.labels.length - 1 
                ? <span key={"span-" + label.value} className="r-box-arrow fa fa-arrow-right" /> 
                : null;

            return [box, arrow];
        }).flat();

    return <div className="r-boxoptions">
        {boxes}
    </div>
}

export default BoxOptions