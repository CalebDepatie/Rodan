import React, { useState, useEffect } from 'react';
import g from 'guark';

import { Chart } from 'primereact/chart';

function FinanceReview(props: any) {
  const [ financedata, setFinancedata ] = useState<any[]>([]);
  const [ cats, setCats ]   = useState([]);
  const [ coms, setComs ]   = useState([]);

  const [ monthOverallBreakdown, setMOB ] = useState<{[key: string]: any}>({});

  useEffect(() => {
    g.call("get_cat", {}).then(async res => {
      const data = await JSON.parse(res);

      data.map((itm: any) => {
        return [itm.id, itm.name, itm.descrip]
      });

      setCats(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    g.call("get_com", {}).then(async res => {
      const data = await JSON.parse(res);

      data.map((itm: any) => {
        return [itm.id, itm.name, itm.descrip]
      });

      setComs(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    const date = new Date;
    g.call("get_finances", {body: JSON.stringify({month: (date.getMonth()+1), year: date.getFullYear()})}).then(async res => {
      const data = await JSON.parse(res);
      console.log("RES", res);
      setFinancedata(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });
  }, []);

  useEffect(() => {
    console.log("FINDATA:",financedata);
    const Income:number[] = Array(financedata.length)
                          .fill(0)
                          .map((itm:number, idx:number) => {
      return financedata.filter((data:any) => data.type===2)
                        .filter((data:any) => {
                          const d = new Date((data.date as unknown as number) * 1000);
                          d.setDate(d.getDate() + 1);
                          return d.getDay() === idx;
                        }).reduce((total:number, data:any) => { return total+data.price });

    });

    /*setMOB({
      labels: Array(financedata.length).keys(),
      datasets: [
        {
          label: 'Income',
          data: Income,
          fill: false,
          borderColor: '#42A5F5',
          tension: .4
        },
      ]
    });*/
  }, [financedata]);

  return (
    <div>
      <div style={{float: "left", width: "50%"}}>
        <h2 className="font-weight-light">Overall Breakdown</h2>
        <Chart type="line" data={monthOverallBreakdown} />
      </div>
      <div style={{float: "left", width: "50%"}}>
        <h2 className="font-weight-light">Expenses Breakdown</h2>
      </div>
    </div>
  );
};

export default FinanceReview;
