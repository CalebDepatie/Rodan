import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

import { toast } from 'react-toastify';

import { dateFormatter, currencyFormatter } from 'common';

export function Liquid(props:{}) {
  const [financeData, setFinanceData] = useState([]);

  const refresh = async () => {
    const res = await ipcRenderer.invoke('liquid-get', {});

    if (res.error != undefined) {
      toast.error("Could not load finance records: " + res.error)
    }

    setFinanceData(res.body);
  }

  useEffect(() => {
    refresh();
  }, []);

  const equalPercent = (100 / ((financeData?.[0]?.length ?? 0) + 3)) + "%"

  // functions to enable creating a 'minimalist' and dynamic table
  const createHeader = () => {

    const names = ["Week Ending", ...(financeData?.[0] ?? []), "Total", "Net"].map(el => {
      return <div className="r-fin-content" style={{width:equalPercent}}>{el}</div>
    });

    return <div className='r-fin-row r-fin-header'>
      {names}
    </div>
  };

  const createRows = () => {
    const rows = (financeData?.[1] ?? []).map((el:any, idx:number) => {
      const totalVal = el.accounts.reduce((total, cur) => total+(parseFloat(cur.balance)), 0)

      return <div className='r-fin-row'>
        <div className='r-fin-content' style={{width:equalPercent}}>{dateFormatter(new Date(el.date))}</div>

          {(financeData?.[0] ?? []).map(acctName => {
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
    {createRows()}
  </div>
}
