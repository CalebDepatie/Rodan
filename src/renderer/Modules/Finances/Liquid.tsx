import React, { useState, useEffect } from 'react'
import { ipcRenderer } from 'electron'

import * as dayjs from 'dayjs'
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

import { toast } from 'react-toastify'

import { InputText, Button, Row, Cell, Ledger, Modal } from '../../Components'
import { dateFormatter, currencyFormatter } from 'common'

export function Liquid(props:{}) {
  const [ financeData, setFinanceData ] = useState([[], []])
  const [ tempData, setTempData ] = useState({})
  const [ modalOpen, setModalOpen ] = useState(false)
  const [ newColumn, setNewColumn ] = useState("")

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

  const addNewColumn = async () => {
    setModalOpen(true)
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

  const addBlankColumn = () => {
    setFinanceData(curState => {
      if (curState[0].includes(newColumn))
        return curState // for some reason this set state is getting run twice

      const newFinanceData = [...curState]
      newFinanceData[0].push(newColumn)
      // newFinanceData[1].forEach((el:any) => el.accounts.push({name:newColumn, balance:0}))
      return newFinanceData
    })

    setNewColumn("")
    // setModalOpen(false)
  }

  const newColumnButton = <Button icon="fa fa-plus" label="Add New Account" onClick={addNewColumn} style={{backgroundColor:"transparent", color:"black"}}/>

  return <div className="r-dashboard-container">
    <Ledger columns={["Week Ending", ...financeData[0], "Total", "Net"]}>
      {createBlankRow()}
      {createRows()}
    </Ledger>
    {newColumnButton}

    <Modal header="Add New Account" style={{width:"60vw"}} visible={modalOpen} 
      onHide={() => setModalOpen(false)} footer={(
        <Button label="Submit" className="r-button-success" onClick={addBlankColumn} />
      )}>
      <label>Account Name</label>
      <InputText value={newColumn} onChange={(e) => setNewColumn(e.target.value)} />
    </Modal>
  </div>
}
