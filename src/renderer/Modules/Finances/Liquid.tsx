import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

import { toast } from 'react-toastify';

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

  console.log(financeData)

  const equalPercent = (100 / (financeData?.[0]?.length ?? 0)) + "%"

  // functions to enable creating a 'minimalist' and dynamic table
  const createHeader = () => {

    const names = ["Week of", ...(financeData?.[0] ?? []), "Weekly Net"].map(el => {
      return <div className="r-fin-content r-fin-header" style={{width:equalPercent}}>{el}</div>
    });

    return <div className='r-fin-row'>
      {names}
    </div>
  };

  const createRows = () => {
    const rows = (financeData?.[1] ?? []).map(el => {
      return <div className='r-fin-row'>
        <div className='r-fin-content' style={{width:equalPercent}}>{el.date}</div>

          {(financeData?.[0] ?? []).map(acctName => {
            const account = el.accounts.find(account => account.name === acctName);

            return <div className='r-fin-content' style={{width:equalPercent}}>
              {account?.balance ?? 'N/A'}
            </div>
          })}

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
