import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle('liquid-get', async (e, req) => {
  try {
    // pull raw data
    const finance_res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/get_accounts`);
    const finance_json = await finance_res.json()

    // convert to desired layout
    let finance_dyn = finance_json.reduce((curArray:any, curValue:any) => {
      const dayObj = curArray.find(el => el.date === curValue.date);

      if (dayObj === undefined) {
        // add day to the array
        const newDay = {date: curValue.date, totalVal: +curValue.balance, accounts: [
          {name: curValue.name, balance: curValue.balance},
        ]};

        curArray.push(newDay);

        return curArray;
      }

      // add the extra account
      dayObj.accounts.push({name: curValue.name, balance: curValue.balance});
      dayObj.totalVal += (+curValue.balance)

      return curArray;
    }, []);

    finance_dyn = finance_dyn.map((el:any, idx:number) => {
      if (idx !== finance_dyn.length-1) {
        el = {...el, netVal: el.totalVal - finance_dyn[idx+1].totalVal}
      }

      return el;
    });

    const account_names = finance_json.reduce((curArray:any, curValue:any) => {
      const exists = curArray.includes(curValue.name);

      if (!exists) {
        curArray.push(curValue.name);
      }

      return curArray;
    }, []);

    account_names.sort();

    return {
      body: [account_names, finance_dyn.slice(0, finance_dyn.length-1)]
    };

  } catch (err) {
    return {
      body: [[], []],
      error: err
    }
  }
});

ipcMain.handle('liquid-set', async (e, req) => {
  try {
    // temporarily looping over sql requests until they can be bulked
    for (const account in req) {
      const value = req[account];

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: account, balance: value})
      }

      const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/create_balance`, options);
    }

    return {
      error: null
    }
  } catch (err) {
    return {
      error: err
    }
  }
});

ipcMain.handle('finance-summary-get', async (e, req) => {
  try {
    const res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/Gojira/get_finance_summary`);
    const data = await res.json()

    const monthly = data.map((el:any, idx:number) => {
      if (idx !== 0) {
        el = {...el, netVal: el.balance - data[idx-1].balance}
      }

      return el;
    });

    return {
      body: {
        monthly: monthly,
      }
    }
  } catch (err) {
    return {
      error: err
    }
  }
});
