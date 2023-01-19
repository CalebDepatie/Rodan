import React, { useState, useEffect, useMemo } from 'react'
import { Card } from "../../Components"
import { ipcRenderer } from 'electron'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  // Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  // Legend
)

import * as dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

import { Line } from "react-chartjs-2"

export const FinanceCard = (props:{}) => {
  const [ summary, set_summary ] = useState({
    monthly: [],
  })

  useEffect(() => {
    const fn = async () => {
      const res = await ipcRenderer.invoke('finance-summary-get', {})

      if (res.error != undefined) {
        // toast.error("Could not load finance summary: " + res.error.message)
      }

      set_summary(res.body ?? {monthly: []})
    }

    fn()
  }, [])

  const delta_chart_data = useMemo(() => {
    const data = summary.monthly.slice(1,summary.monthly.length)
    return ({
    labels: data.map(el => dayjs(`${('0' + el.month).slice(-2)}-${el.year}`, "MM-YYYY").format('MMM-YY')),
    datasets: [
      {
        label: "Account Delta",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: data.map(el => el.netVal),
      }
    ]
  })}, [summary])

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <Card title="Finance Delta">
      <Line data={delta_chart_data} options={options} />
    </Card>
  )
}
