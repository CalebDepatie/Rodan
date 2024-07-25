import React, { useState, useEffect, useMemo } from 'react'
import { ipcRenderer } from 'electron'
import { toast } from 'react-toastify'
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

import { Line } from "react-chartjs-2"

import { TabView, TabPanel } from '../../Components'
import { useCache } from '../../Hooks'
import { Liquid } from "./Liquid"

import "./Finances.scss"

export function FinanceDashboard(props:{}) {
      const [ finance_res, finance_signal ] = useCache('finance-summary-get', {})
      const [ accounts_res, accounts_signal ] = useCache('accounts-get', {})

      const summary = finance_res.body ?? {monthly: []}
      const accounts = accounts_res.body ?? {monthly: []}

      useEffect(() => {
        if (finance_res.error != undefined) {
          toast.error("Could not load finance summary: " + finance_res.error.message)
        }
      }, [finance_res])

      useEffect(() => {
        if (accounts_res.error != undefined) {
          toast.error("Could not load accounts summary: " +accounts_res.error.message)
        }
      }, [accounts_res])

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

        if (accounts.monthly.length < 2) {
          return {
            labels: [],
            datasets: []
          }
        }

        const summary_data = summary.monthly.slice(1, summary.monthly.length);

        let datasets = [
          {
            label: "Total Delta",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: summary_data.map(el => el.netVal),
          }
        ]

        let data = accounts.monthly.map((el:any, idx:number) => {
          const previousBalance = accounts.monthly.slice(0, idx)
              .reverse()
              .find((e: any) => e.name === el.name)
              ?.balance ?? 0;
          
          // An undefined previous balance implies this is the first month
          if (previousBalance != undefined) {
            el = {...el, netVal: el.balance - previousBalance};
          } else {
            el = {...el, netVal: el.balance};
          }
          
          return el;
        });

        const labels = summary_data.map(el => dayjs(`${('0' + el.month).slice(-2)}-${el.year}`, "MM-YYYY").format('MMM-YY'));

        const uniqueNames = [...new Set(data.map(el => el.name))];

        uniqueNames.forEach(account_name => {
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);

          const colour = `rgb(${r}, ${g}, ${b})`

          const dataset_values = data.filter(el => el.name === account_name)

          // Pad the dataset with 0s if it's offset in the front of the back
          if (dataset_values.length < labels.length+1) {
            const diff = labels.length - dataset_values.length+1;

            // determine if this should be at the front or back
            if (dayjs(`${('0' + dataset_values[0].month).slice(-2)}-${dataset_values[0].year}`, "MM-YYYY").format('MMM-YY') === labels[0]) {
              for (let i = 0; i < diff; i++) {
                dataset_values.push({netVal: null});
              }
            } else {
              for (let i = 0; i < diff; i++) {
                dataset_values.unshift({netVal: null});
              }
            }
          }

          datasets.push({
            label: account_name,
            backgroundColor: colour,
            borderColor: colour,
            data: dataset_values.map(el => el.netVal).slice(1, dataset_values.length),
          })
        });

        return ({
          labels: labels,
          datasets: datasets,
      })}, [accounts, summary])

      const options = {
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      };

       return <>
        <div className='r-dashboard-container'>
          <div style={{height: "350px", display: "flex"}}>
            <Line data={monthly_chart_data} options={options} style={{height: "250px"}} />
            <Line data={delta_chart_data} options={options} style={{height: "250px"}} />
          </div>

          {
          // <div className="r-fin-row">
          //   (Current Total Values)
          // </div>
          }

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
