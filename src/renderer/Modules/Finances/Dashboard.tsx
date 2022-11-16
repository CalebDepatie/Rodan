import React, { useState, useEffect, useMemo } from 'react';
import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

import * as dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

import { Line } from "react-chartjs-2";

import { TabView, TabPanel } from 'primereact/tabview';
import { Liquid } from "./Liquid";

import "./Finances.scss";

export function FinanceDashboard(props:{}) {
      const [ summary, set_summary ] = useState({
        monthly: [],
      });

      useEffect(() => {
        const fn = async () => {
          const res = await ipcRenderer.invoke('finance-summary-get', {});

          if (res.error != undefined) {
            toast.error("Could not load finance summary: " + res.error.message)
          }

          console.log(res.body)
          set_summary(res.body ?? {monthly: []});
        }

        fn();
      }, []);

      const monthly_chart_data = useMemo(() => ({
        labels: summary.monthly.map(el => dayjs(`${('0' + el.month).slice(-2)}-${el.year}`, "MM-YYYY").format('MMM-YY')),
        datasets: [
          {
            label: "Account total",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: summary.monthly.map(el => el.balance),
          }
        ]
      }), [summary])

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
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      };

       return <>
        <div className='r-dashboard-container'>
          <div style={{height: "250px", display: "flex"}}>
            <Line data={monthly_chart_data} options={options} style={{height: "250px"}} />
            <Line data={delta_chart_data} options={options} style={{height: "250px"}} />
          </div>

          <div className="r-fin-row">
            (Current Total Values)
          </div>

          <TabView style={{width:'90vw'}}>
            <TabPanel header="Liquid">
              <Liquid />
            </TabPanel>

            <TabPanel header="Illiquid" disabled={true}>

            </TabPanel>
          </TabView>

        </div>
       </>
}
