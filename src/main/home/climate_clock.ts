import { ipcMain } from 'electron';
import fetch from 'electron-fetch';

ipcMain.handle('climate-clock-get', async (e, req) => {
  const res = await fetch('https://api.climateclock.world/v2/widget/clock.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await res.json()
  const modules = json.data.modules

  const return_data = {
    deadline: modules.carbon_deadline_1,
    renewables: modules.renewables_1,
    gcf: modules.green_climate_fund_1,
    indie: modules.indigenous_land_1,
    women: modules.women_in_parliments,
    debt7: modules.loss_damage_g7_debt,
    debt20: modules.loss_damage_g20_debt,
    divest: modules.ff_divestment_stand_dot_earth,
  }

  return return_data
})