import React, { useState } from 'react';

import { TabView, TabPanel } from 'primereact/tabview';
import { Liquid } from "./Liquid";

import "./Finances.scss";

export function FinanceDashboard(props:{}) {

       return <>
        <div className='r-dashboard-container'>
          (Liquid + Illiquid Graph)

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