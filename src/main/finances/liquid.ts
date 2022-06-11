import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle('liquid-get', async (e, req) => {
  try {
    // pull raw data
    const finance_res = await fetch(`${process.env.HOSTNAME}:${process.env.PORT}/get_accounts`);
    const finance_json = await finance_res.json()

    // convert to desired layout
    const finance_dyn = finance_json.reduce((curArray:any, curValue:any) => {
      const dayObj = curArray.find(el => el.date === curValue.date);

      if (dayObj === undefined) {
        // add day to the array
        const newDay = {date: curValue.date, accounts: [
          {name: curValue.name, balance: curValue.balance},
        ]};

        curArray.push(newDay);

        return curArray;
      }

      // add the extra account
      dayObj.accounts.push({name: curValue.name, balance: curValue.balance});

      return curArray;
    }, []);

    const account_names = finance_json.reduce((curArray:any, curValue:any) => {
      const exists = curArray.includes(curValue.name);

      if (!exists) {
        curArray.push(curValue.name);
      }

      return curArray;
    }, [])

    account_names.sort();

    return {
      body: [account_names, finance_dyn]
    };

  } catch (err) {
    return {
      body: [[], []],
      error: err
    }
  }
});
