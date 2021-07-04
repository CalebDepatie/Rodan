import React, { useState, useEffect } from 'react';
import g from 'guark';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

function RawData(props: any) {
  const [ tabledata, setTabledata ] = useState<any[]>([]);
  const [ start, setStart ] = useState<string>('');
  const [ end, setEnd ]     = useState<string>('');
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
  }, []);

  const addForTime = (year: number, month: number) => {
    g.call("get_finances", {month: month.toString(), year: year.toString()}).then(async res => {
      const data = await JSON.parse(res);

      setTabledata([...tabledata, ...data]);
    }).catch(error => {
      console.error('Error Getting Data', error);
    });
  };

  const clear = () => {
    setTabledata([]);
  };

  useEffect(() => {
    clear();
    if (start === "" && end === "") return;
    const start_date = start.split("-");
    const end_date   = end.split("-");

    let cur_year: number  = +start_date[0];
    let cur_month: number = +start_date[1];

    do {
      addForTime(cur_year, cur_month);
      if (cur_month < 12) {
        cur_month++;
      } else {
        cur_month = 1;
        cur_year++;
      }
    } while ((cur_year <= +end_date[0]) && (cur_month <= +end_date[1]));

  }, [start, end]);

  return (
    <>
      <Form>
        <Form.Row style={{margin:"auto", width:"30rem"}}>
          <Col>
            <Form.Group controlId="start">
              <Form.Label>Start</Form.Label>
              <Form.Control required type='month' onChange={e => setStart(e.target.value) }/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="end">
              <Form.Label>End</Form.Label>
              <Form.Control required type='month' onChange={e => setEnd(e.target.value) }/>
            </Form.Group>
          </Col>
        </Form.Row>
      </Form>
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
    </>
  );
};

export default RawData;
