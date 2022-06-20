import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

import { toast } from 'react-toastify';

import { InputText } from '../../Components';
import { dateFormatter, currencyFormatter } from 'common';

export function Liquid(props:{}) {
  const [financeData, setFinanceData] = useState([[], []]);
  const [ tempData, setTempData ] = useState({});

  const refresh = async () => {
    const res = await ipcRenderer.invoke('liquid-get', {});

    if (res.error != undefined) {
      toast.error("Could not load finance records: " + res.error.message)
    }

    setFinanceData(res.body);
  }

  useEffect(() => {
    refresh();
  }, []);

  const equalPercent = (100 / (financeData[0].length + 3)) + "%"

  // functions to enable creating a 'minimalist' and dynamic table
  const createHeader = () => {

    const names = ["Week Ending", ...financeData[0], "Total", "Net"].map(el => {
      return <div className="r-fin-content" style={{width:equalPercent}}>{el}</div>
    });

    return <div className='r-fin-row r-fin-header'>
      {names}
    </div>
  };

  // creates the top 'blank' row IIF its a Friday to Sunday
  // TODO: make this show up past sunday if prev week doesn't exist
  const createBlankRow = () => {
    const dayOfTheWeek: number = (new Date()).getDay();

    const curWeekComplete: boolean = () => {
      // if no data is returned
      if (financeData[1].length === 0) {
        return false
      }

      const curDateObj = new Date();
      const curDate = curDateObj.getDate();
      const curDay = curDateObj.getDay();
      const lastDate = new Date(financeData[1][0]?.date);

      // if date is equal or within the first and last dates of the week
      return !((curDay >= 5) && (curDay <= 7));
    };

    // >= Monday && <= Thurday
    if (((dayOfTheWeek >= 1) && (dayOfTheWeek <= 4)) || curWeekComplete()) {
      return null
    }

    const row = [
      <div className='r-fin-content' style={{width:equalPercent}}>{dateFormatter(new Date())}</div>,
      ...financeData[0].map(el =>
        <div className='r-fin-content' style={{width:equalPercent}}>
        <InputText value={tempData[el]} style={{width:"80%", height:"98%"}}
          onChange={e => setTempData(cur => ({...cur, [el]: e.target.value}))}/>
        </div>
      ),
      <div className='r-fin-content' style={{width:equalPercent}}>N/A (calculated)</div>,
      <div className='r-fin-content' style={{width:equalPercent}}>N/A (calculated)</div>,
    ];

    return <div className="r-fin-row">{row}</div>
  };

  const createRows = () => {
    const rows = financeData[1].map((el:any, idx:number) => {
      const totalVal = el.accounts.reduce((total, cur) => total+(parseFloat(cur.balance)), 0)

      return <div className='r-fin-row'>
        <div className='r-fin-content' style={{width:equalPercent}}>{dateFormatter(new Date(el.date))}</div>

          {financeData[0].map(acctName => {
            const account = el.accounts.find(account => account.name === acctName);
            const value = account != undefined
                            ? currencyFormatter(account!.balance)
                            : 'N/A'

            return <div className='r-fin-content' style={{width:equalPercent}}>
              {value}
            </div>
          })}

        <div className='r-fin-content' style={{width:equalPercent}}>{currencyFormatter(totalVal)}</div>

        <div className='r-fin-content' style={{width:equalPercent}}>N/A for testing</div>
      </div>
    });

    return <>{rows}</>
  };

  return <div className="r-dashboard-container">
    {createHeader()}
    {createBlankRow()}
    {createRows()}
  </div>
}
