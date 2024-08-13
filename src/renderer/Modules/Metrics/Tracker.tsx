import React from 'react'

import { IconPicker } from '../../Components'

type TrackerType = 'bool' | 'tri' | 'number'

interface Activity {
    name: string;
    icon: string;
    type: TrackerType;
    data: any[];
}

interface ActivityRowProps {
    activity: Activity;
}

function ActivityRow(props: ActivityRowProps) {
    return (
        <div>
            <span className={`fa ${props.activity.icon}`} />
            <span>{props.activity.name}</span>

            <br/>

            <div style={{ display: "flex", flexDirection: "row" }}>
            {
                props.activity.data.map((item: any) => {
                    return <ActivityItem type={props.activity.type} value={item} />
                })
            }
            </div>
        </div>
    )
}

interface ActivityItemProps {
    type: TrackerType;
    value: any;
}

function ActivityItem(props: ActivityItemProps) {
    let img: React.ReactNode;

    switch (props.type) {
        case 'bool':
            img = <div style={{backgroundColor: props.value == 1 ? "blueviolet" : "slategray", height:"100%", width:"100%"}} />
            break;

        case 'tri':
            const left  = props.value == 0 ? "slategray" : "blueviolet"
            const right = props.value == 2 ? "blueviolet" : "slategray"

            img = <>
                <div style={{backgroundColor: left, height: "100%", width:"49%", marginRight:"2%"}}></div>
                <div style={{backgroundColor: right, height: "100%", width:"49%"}}></div>
            </>
            break;

        case 'number':
            img = props.value
            break;
    }

    return (
        <div style={{overflow: "hidden", borderRadius: "50%", backgroundColor: "lightgray", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            {img}
        </div>
    )
}

function Tracker() {
    const activities: Activity[] = [
        {
            name: "Two",
            icon: "fa-biking",
            type: "bool",
            data: [
                0, 1, 0, 1, 0, 1, 0,
            ]
        },
        {
            name: "Three",
            icon: "fa-biking",
            type: "tri",
            data: [
                0, 1, 2, 1, 0, 1, 2,
            ]
        },
        {
            name: "Number",
            icon: "fa-biking",
            type: "number",
            data: [
                8, 1, 2, 10, 0, 100, 2,
            ]
        },
    ]

    return (
        <div style={{backgroundColor: "whitesmoke"}}>
            {
                activities.map((activity: Activity) => {
                    return <ActivityRow activity={activity} />
                })
            }
        </div>
    )
}

export default Tracker