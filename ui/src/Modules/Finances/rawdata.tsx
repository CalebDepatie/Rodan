import React, { useState, useEffect } from 'react';
import g from 'guark';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';

function RawData(props: any) {
  const [ tabledata, setTabledata ] = useState<any[]>([]);
  const [ date, setDate ]   = useState<Date>(new Date());
  const [ cats, setCats ]   = useState([]);
  const [ coms, setComs ]   = useState([]);

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
  }, []);

  useEffect(() => {
    g.call("get_finances", {month: date.getMonth() as unknown as string, year: date.getFullYear() as unknown as string}).then(async res => {
      const data = await JSON.parse(res);

      setTabledata(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });
  }, [date]);

  const catFormat = (row: any) => {
    return cats.filter(itm2 => itm2["id"] === row.cat).length !== 0 ? cats.filter(itm2 => itm2["id"] === row.cat)[0]['name'] : ""
  };

  const comFormat = (row: any) => {
    return coms.filter(itm2 => itm2["id"] === row.com)[0]['name']
  };

  return (
    <>
      <Calendar dateFormat="yy/mm" view="month" value={date} onChange={(e) => setDate(e.value as Date)}/>
      <DataTable value={tabledata}>
        <Column field="cat" header="Category" body={catFormat}/>
        <Column field="com" header="Companies" body={comFormat} />
        <Column field="name" header="Name" />
        <Column field="price" header="Price" />
        <Column field="date" header="Date" />
        <Column field="type" header="Type" />
      </DataTable>
    </>
  );
};

export default RawData;
