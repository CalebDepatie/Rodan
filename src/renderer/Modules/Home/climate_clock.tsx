import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { Card } from '../../Components'
import dayjs from 'dayjs';

// Using https://github.com/climateclock/climate-clock-widget as a general base
export function ClimateClock(props:{}) {
  const [cdata, setCdata] = useState<any>(null);

  useEffect(() => {
    const fn = async () => {
      const res = await ipcRenderer.invoke("climate-clock-get", null)
      setCdata(res)
    }
    fn()
  }, [])

  const remaining = () => {
    if (!cdata) return ""

    const date = dayjs(cdata.deadline.timestamp)
    const now = dayjs()
    const years = date.diff(now, "year")
    const days = date.diff(now, "day") - (years * 365)
    
    return years + "yrs " + days + "days"
  }

  const renewables = () => {
    if (!cdata) return ""

    const now = dayjs()
    const tElapsed = now.diff(dayjs(cdata.renewables.timestamp))
    const percent = cdata.renewables.initial + ((tElapsed / 1000) * cdata.renewables.rate)
    
    return percent.toFixed(5)
  }

  return <>
    <Card title="Climate Clock" style={{textAlign: 'center'}}>
      Time Remaining:
      <br/>
      <b>
        {remaining()}
      </b>
      <br/>
      Energy From Renewables:
      <b>
        {renewables()}%
      </b>
    </Card>
  </>
}