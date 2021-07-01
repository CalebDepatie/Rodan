import React, { useState, useEffect } from 'react';
import g from 'guark';

import Table from 'react-bootstrap/Table'

function RawData(props: any) {
  const [ tabledata, setTabledata ] = useState([]);
  const [ month, setMonth ] = useState([]);
  const [ year, setYear ]   = useState([]);
  const [ cats, setCats ]   = useState([]);
  const [ coms, setComs ]   = useState([]);

  useEffect(() => {
    g.call("get_cat", {}).then(async res => {
      //console.log(res);
      const data = await JSON.parse(res);

      data.map((itm: any) => {
        return [itm.id, itm.name, itm.descrip]
      });

      setCats(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    g.call("get_com", {}).then(async res => {
      //console.log(res);
      const data = await JSON.parse(res);

      data.map((itm: any) => {
        return [itm.id, itm.name, itm.descrip]
      });

      setComs(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    g.call("get_finances", {month: "6", year: "2021"}).then(async res => {
      const data = await JSON.parse(res);

      setTabledata(data);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });
  }, []);

  return (
    <Table striped bordered variant="dark">
      <thead>
        <tr>
          <th>Category</th>
          <th>Company</th>
          <th>Description</th>
          <th>Price</th>
          <th>Date</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {tabledata.map((itm: any, i: number) => {
          return (
            <tr key={"tr_" + i}>
              <td key={"cat_" + i}>{cats.filter(itm2 => itm2["id"] === itm.cat).length !== 0 ? cats.filter(itm2 => itm2["id"] === itm.cat)[0]['name'] : ""}</td>
              <td key={"com_" + i}>{coms.filter(itm2 => itm2["id"] === itm.com)[0]['name']}</td>
              <td key={"name_" + i}>{itm.name}</td>
              <td key={"price_" + i}>{itm.price}</td>
              <td key={"date_" + i}>{itm.date}</td>
              <td key={"type_" + i}>{itm.type}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default RawData;
