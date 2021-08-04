import React, { useState, useEffect, useRef } from 'react';
import g from 'guark';

import { Chart } from 'primereact/chart';

function FinanceReview(props: any) {
  const [ financedata, setFinancedata ] = useState<any[]>([]);
  const [ cats, setCats ]   = useState([]);
  const [ coms, setComs ]   = useState([]);

  const [ monthOverallBreakdown, setMOB ] = useState<{[key: string]: any}>({});
  const [ monthExpenseBreakdown, setMEB ] = useState<{[key: string]: any}>({});

  const mobRef = useRef<any>(null);

  useEffect(() => {
    g.call("get_cat", {}).then(async res => {
      const data = await JSON.parse(res);

      setCats(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    g.call("get_com", {}).then(async res => {
      const data = await JSON.parse(res);

      setComs(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    const date = new Date;
    g.call("get_finances", {body: JSON.stringify({month: (date.getMonth()+1), year: date.getFullYear()})}).then(async res => {
      const data = await JSON.parse(res);
      setFinancedata(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });
  }, []);

  useEffect(() => {
    const Income:number[] = Array(31) // arbitrarily set rn
                          .fill(0);
      /*                    .map((itm:number, idx:number) => {
      return financedata.filter((data:any) => data.type===2)
                        .filter((data:any) => {
                          const d = new Date((data.date as unknown as number) * 1000);
                          d.setDate(d.getDate() + 1);
                          return d.getDay() === idx;
                        }).reduce((total:number, data:any) => { return total+data.price });

    });*/

    setMOB({
      labels: Array(31).keys(),
      datasets: [
        {
          label: 'Income',
          data: Income,
          fill: false,
          borderColor: '#42A5F5',
          tension: .4
        },
      ]
    });

    setMEB({
      labels: cats.sort((itm1:any, itm2:any) => itm1.id - itm2.id).map((itm:any) => itm.name),
      datasets: [
        {
          data: Object.values(financedata.filter((row:any) => row.cat !== -1)
                      .concat([...cats.map((itm:any) => ({cat: itm.id, price:0}))]) // pushes an empty value for every category so the graph doesnt get tripped up
                      .groupBy("cat")).map((row:any) => {
            return row.reduce((total:number, curVal:any) => {
              return total+curVal.price;
            },0);
          }),
          backgroundColor: [
              "#F3722C", // housing
              "#90BE6D", // cannabis
              "#43AA8B", // food
              "#F8961E", // video games
              "#F9C74F", // gas
              "#577590", // misc
              "#4D908E", // alcohol
              "#277DA1", // h&h
          ],
          hoverBackgroundColor: [
              "#f2905c",
              "#a6bf93",
              "#64aa95",
              "#f7ab4f",
              "#f9d581",
              "#72818e",
              "#688e8d",
              "#4685a0",
          ]
        }
      ]
    });
  }, [financedata]);

  useEffect(() => {
    mobRef!.current!.refresh();
  }, [monthOverallBreakdown]);

  return (
    <div>
      <div style={{float: "left", width: "50%"}}>
        <h2 className="font-weight-light">Overall Breakdown</h2>
        <Chart ref={mobRef} type="line" data={monthOverallBreakdown} />
      </div>
      <div style={{float: "left", width: "50%"}}>
        <h2 className="font-weight-light">Expenses Breakdown</h2>
        <Chart type="pie" data={monthExpenseBreakdown} />
      </div>
    </div>
  );
};

export default FinanceReview;
