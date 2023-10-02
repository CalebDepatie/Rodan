import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { Card } from '../../Components'
import { useCache } from '../../Hooks';
import dayjs from 'dayjs';

// Using https://github.com/climateclock/climate-clock-widget as a general base
export function ClimateClock(props:{}) {
  const [climate_cache, climate_signal] = useCache('climate-clock-get', {})

  const remaining = () => {
    if (Object.keys(climate_cache).length === 0) return ""

    const date = dayjs(climate_cache.deadline.timestamp)
    const now = dayjs()
    const years = date.diff(now, "year")
    const days = date.diff(now, "day") - (years * 365)
    
    return years + "yrs " + days + "days"
  }

  const renewables = () => {
    if (Object.keys(climate_cache).length === 0) return ""

    const now = dayjs()
    const tElapsed = now.diff(dayjs(climate_cache.renewables.timestamp))
    const percent = climate_cache.renewables.initial + ((tElapsed / 1000) * climate_cache.renewables.rate)
    
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
