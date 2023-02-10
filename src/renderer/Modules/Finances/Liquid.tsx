import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import * as dayjs from 'dayjs'
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

import { toast } from 'react-toastify'

import { InputText, Button, Row, Cell, Ledger } from '../../Components'
import { dateFormatter, currencyFormatter } from 'common'

export function Liquid(props:{}) {
  const [ financeData, setFinanceData ] = useState([[], []])
  const [ tempData, setTempData ] = useState({})

  const refresh = async () => {
    const res = await ipcRenderer.invoke('liquid-get', {})

    if (res.error != undefined) {
      toast.error("Could not load finance records: " + res.error.message)
    }

    setFinanceData(res.body)
  }

  useEffect(() => {
    refresh()
  }, [])

  const equalPercent = (100 / (financeData[0].length + 3)) + "%"

  const submitValues = async () => {
    const res = await ipcRenderer.invoke('liquid-set', tempData)
    if (res.error != undefined) {
      toast.error("Could not save finance records: " + res.error.message)
    }

    refresh()
  }

  // creates the top 'blank' row IIF the current calander week has no record
  const createBlankRow = () => {
    const dayOfTheWeek: number = (new Date()).getDay()

    const curWeekComplete: boolean = () => {
      // if no data is returned
      if (financeData[1].length === 0) {
        return false
      }

      const curWeek = dayjs().week();
      const prevRecordWeek = dayjs(financeData[1][0].date).week()

      return curWeek == prevRecordWeek
    };

    if (curWeekComplete()) {
      return null
    }

    const row = [
      <Cell key="blank-date" style={{width:equalPercent}}>{dateFormatter(new Date())}</Cell>,
      ...financeData[0].map(el =>
        <Cell key={"blank-" + el} style={{width:equalPercent}}>
          <InputText value={tempData[el]} style={{width:"80%", height:"98%"}}
            onChange={e => setTempData(cur => ({...cur, [el]: e.target.value}))}/>
        </Cell>
      ),
      <Cell key="blank-submit" style={{width:`calc(${equalPercent} + ${equalPercent})`}}>
        <Button icon={"fa fa-upload"} label="Submit Values" onClick={submitValues}></Button>
      </Cell>,
    ];

    return <Row key="blank-row">{row}</Row>
  };

  const createRows = () => {
    return financeData[1].map((el:any, idx:number) => {

      const accountData = financeData[0].map(acctName => {
        const account = el.accounts.find(account => account.name === acctName)

        return account != undefined
                        ? currencyFormatter(account!.balance)
                        : 'N/A'
      })

      const data = [
        dateFormatter(new Date(el.date)),
        ...accountData,
        currencyFormatter(el.totalVal),
        currencyFormatter(el.netVal)
      ]

      return <Row key={data.date} data={data}/>
    });
  };

  return <div className="r-dashboard-container">
    <Ledger columns={["Week Ending", ...financeData[0], "Total", "Net"]}>
      {createBlankRow()}
      {createRows()}
    </Ledger>
  </div>
}
