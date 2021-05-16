import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

type catcomData = [number, string, string];

interface MetaData {
  cats: catcomData[];
  coms: catcomData[];
}

function Recurring(props: MetaData) {
  const [ form, setForm ] = useState({});

  const setField = async (field:string, value:any) => {
    setForm({
      ...form, [field]: value
    });
  }

	const handleSubmit = async (evt: any) => {
		evt.preventDefault();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Origin': 'home' },
        body: JSON.stringify(form)
    };

    await fetch('/api/newrecur', requestOptions)
      .then(async res => {
        if (!res.ok) {
          return Promise.reject(res.status);
        }
      })
      .catch(error => {
        console.error('Error Sending Payment', error);
      });
	}

	return (
		<Form onSubmit={handleSubmit}>
      <Form.Row>
        <Col>
          <Form.Group controlId="recur.name">
            <Form.Label>Name</Form.Label>
            <Form.Control onChange={e => setField('name', e.target.value) }/>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="recur.price">
          <Form.Label>Price</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type='number' onChange={e => setField('price', +e.target.value) }/>
          </InputGroup>
        </Form.Group>
        </Col>
      </Form.Row>

      <Form.Row>
        <Col>
          <Form.Group controlId="recur.catSelect">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" onChange={e => setField('cat', +e.target.value) }>
              {props.cats.map((itm, i) =>
              <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="recur.comSelect">
          <Form.Label>Company</Form.Label>
          <Form.Control as="select" onChange={e => setField('com', +e.target.value) }>
            {props.coms.map((itm, i) =>
            <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
          </Form.Control>
        </Form.Group>
        </Col>
      </Form.Row>

      <Form.Row>
        <Col>
        <Form.Group controlId="recur.start">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type='date' onChange={e => setField('start_date', e.target.value) }/>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="recur.end">
          <Form.Label>End Date</Form.Label>
          <Form.Control type='date' onChange={e => setField('end_date', e.target.value) }/>
        </Form.Group>
        </Col>
      </Form.Row>

      <Form.Row>
        <Form.Control type='submit' value='Submit'/>
      </Form.Row>
    </Form>
	);
}


function OneTime(props: MetaData) {
  const [ form, setForm ] = useState({});

  const setField = async (field:string, value:any) => {
    setForm({
      ...form, [field]: value
    });
  }

	const handleSubmit = async (evt: any) => {
		evt.preventDefault();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Origin': 'home' },
        body: JSON.stringify(form)
    };

    await fetch('/api/newrecur', requestOptions)
      .then(async res => {
        if (!res.ok) {
          return Promise.reject(res.status);
        }
      })
      .catch(error => {
        console.error('Error Sending Payment', error);
      });
	}

	return (
		<Form onSubmit={handleSubmit}>
      <Form.Row>
        <Col>
          <Form.Group controlId="one.name">
            <Form.Label>Name</Form.Label>
            <Form.Control onChange={e => setField('name', e.target.value) }/>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="one.price">
          <Form.Label>Price</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type='number' onChange={e => setField('price', +e.target.value) }/>
          </InputGroup>
        </Form.Group>
        </Col>
      </Form.Row>

      <Form.Row>
        <Col>
          <Form.Group controlId="one.catSelect">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" onChange={e => setField('cat', +e.target.value) }>
              {props.cats.map((itm, i) =>
              <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="one.comSelect">
          <Form.Label>Company</Form.Label>
          <Form.Control as="select" onChange={e => setField('com', +e.target.value) }>
            {props.coms.map((itm, i) =>
            <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
          </Form.Control>
        </Form.Group>
        </Col>
      </Form.Row>

      <Form.Row>
        <Col>
        <Form.Group controlId="one.date">
          <Form.Label>Date</Form.Label>
          <Form.Control type='date' onChange={e => setField('date', e.target.value) }/>
        </Form.Group>
        </Col>
      </Form.Row>

      <Form.Row>
        <Form.Control type='submit' value='Submit'/>
      </Form.Row>
    </Form>
	);
}

class Payment extends React.Component<{}, {type: string, cats: catcomData[], coms: catcomData[]}> {
	constructor(props: any) {
		super(props)

    let cat: catcomData[] = []
    let com: catcomData[] = []

    fetch('/api/getcat', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    }).then(async res => {
        const data = await res.json();
        if (!res.ok) {
          return Promise.reject(res.status);
        }
        data.forEach((itm: any) => {
          cat.push([itm.id, itm.name, itm.descrip])
        })
      })
      .catch(error => {
        console.error('Error Getting Data', error);
      });

    fetch('/api/getcom', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'}
      }).then(async res => {
          const data = await res.json();
          if (!res.ok) {
            return Promise.reject(res.status);
          }
          data.forEach((itm: any) => {
            com.push([itm.id, itm.name, itm.descrip])
          })
        })
        .catch(error => {
          console.error('Error Getting Data', error);
        });

    this.state = {type: 'oneTime', cats: cat, coms: com};
	}

	pickPayment() {
		switch(this.state.type) {
			case 'oneTime': {return (<OneTime cats={this.state.cats} coms={this.state.coms}/>)}
			case 'recurring': {return (<Recurring cats={this.state.cats} coms={this.state.coms}/>)}
		}
	}

	render() {
		return (
		<div className="home">
		  <div className="container">
			<div className="row align-items-center my-5">
			  <div className="col-lg-5">
				<h1 className="font-weight-light">Add Finance Data</h1>
				<Dropdown onSelect={e => this.setState<never>({type: e}, this.render)}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
					  Record Type:
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item active={this.state.type === 'recurring'} eventKey='recurring'>Recurring</Dropdown.Item>
            <Dropdown.Item active={this.state.type === 'oneTime'} eventKey='oneTime'>One Time</Dropdown.Item>
          </Dropdown.Menu>
				</Dropdown>
        <br />
				<div>{this.pickPayment()}</div>
			  </div>
			</div>
		  </div>
		</div>
		);
	}
}

export default Payment;
