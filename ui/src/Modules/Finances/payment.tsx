import React, { useState } from 'react';
import g from 'guark';

import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
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

    g.call("new_recur", {body: JSON.stringify(form)})
      .catch(error => {
        console.error('Error Sending Payment', error);
      });

	}

	return (
		<Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group controlId="recur.name">
            <Form.Label>Name</Form.Label>
            <Form.Control required onChange={e => setField('name', e.target.value) }/>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="recur.price">
          <Form.Label>Price</Form.Label>
          <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
            <Form.Control required type='text' onChange={e => setField('price', +e.target.value) }/>
            <Form.Control.Feedback type="invalid">
              Please enter a valid price.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="recur.catSelect">
            <Form.Label>Category</Form.Label>
            <Form.Control required as="select" onChange={e => setField('cat', +e.target.value) }>
              {props.cats.map((itm, i) =>
              <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="recur.comSelect">
          <Form.Label>Company</Form.Label>
          <Form.Control required as="select" onChange={e => setField('com', +e.target.value) }>
            {props.coms.map((itm, i) =>
            <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
          </Form.Control>
        </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
        <Form.Group controlId="recur.start">
          <Form.Label>Start Date</Form.Label>
          <Form.Control required type='date' onChange={e => setField('start_date', e.target.value) }/>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="recur.end">
          <Form.Label>End Date</Form.Label>
          <Form.Control type='date' onChange={e => setField('end_date', e.target.value) }/>
        </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Control type='submit' value='Submit'/>
        </Col>
        <Col>
          <Form.Control type='reset' value='Clear'/>
        </Col>
      </Row>
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

    g.call("new_one", {body: JSON.stringify(form)})
      .catch(error => {
        console.error('Error Sending Payment', error);
      });
	}

	return (
		<Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group controlId="one.name">
            <Form.Label>Name</Form.Label>
            <Form.Control required onChange={e => setField('name', e.target.value) }/>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="one.price">
          <Form.Label>Price</Form.Label>
          <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
            <Form.Control required type='text' onChange={e => setField('price', +e.target.value) }/>
            <Form.Control.Feedback type="invalid">
              Please enter a valid price.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="one.catSelect">
            <Form.Label>Category</Form.Label>
            <Form.Control required as="select" onChange={e => setField('cat', +e.target.value) }>
              {props.cats.map((itm, i) =>
              <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="one.comSelect">
          <Form.Label>Company</Form.Label>
          <Form.Control required as="select" onChange={e => setField('com', +e.target.value) }>
            {props.coms.map((itm, i) =>
            <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
          </Form.Control>
        </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
        <Form.Group controlId="one.date">
          <Form.Label>Date</Form.Label>
          <Form.Control required type='date' onChange={e => setField('date', e.target.value) }/>
        </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Control type='submit' value='Submit'/>
        </Col>
        <Col>
          <Form.Control type='reset' value='Clear'/>
        </Col>
      </Row>
    </Form>
	);
}

function CatOrCom(props: any) {
  const [ form, setForm ] = useState({});

  const setField = async (field:string, value:any) => {
    setForm({
      ...form, [field]: value
    });
  }

	const handleSubmit = async (evt: any) => {
		evt.preventDefault();

    if (props.cat === true) {
      g.call("new_cat", {body: JSON.stringify(form)})
        .catch(error => {
          console.error('Error Sending Category', error);
        });
    } else {
      g.call("new_com", {body: JSON.stringify(form)})
        .catch(error => {
          console.error('Error Sending Company', error);
        });
    }
	}

	return (
		<Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group controlId="org.name">
            <Form.Label>Name</Form.Label>
            <Form.Control required onChange={e => setField('name', e.target.value) }/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="org.descrip">
            <Form.Label>Description</Form.Label>
            <Form.Control required onChange={e => setField('descrip', e.target.value) }/>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Control type='submit' value='Submit'/>
        </Col>
        <Col>
          <Form.Control type='reset' value='Clear'/>
        </Col>
      </Row>
    </Form>
	);
}

function Income(props: any) {
  const [ form, setForm ] = useState({});

  const setField = async (field:string, value:any) => {
    setForm({
      ...form, [field]: value
    });
  }

	const handleSubmit = async (evt: any) => {
		evt.preventDefault();

    g.call("new_inc", {body: JSON.stringify(form)})
      .catch(error => {
        console.error('Error Sending Income', error);
      });
	}

	return (
		<Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group controlId="inc.name">
            <Form.Label>Name</Form.Label>
            <Form.Control required onChange={e => setField('name', e.target.value) }/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="inc.amount">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
              <Form.Control required type='text' onChange={e => setField('amount', +e.target.value) }/>
              <Form.Control.Feedback type="invalid">
                Please enter a valid amount.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="inc.comSelect">
            <Form.Label>Company</Form.Label>
            <Form.Control required as="select" onChange={e => setField('com', +e.target.value) }>
              {props.coms.map((itm: catcomData, i: number) =>
              <option key={itm[1]} value={i+1}>{itm[1]}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="inc.date">
            <Form.Label>Date</Form.Label>
            <Form.Control required type='date' onChange={e => setField('date', e.target.value) }/>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Control type='submit' value='Submit'/>
        </Col>
        <Col>
          <Form.Control type='reset' value='Clear'/>
        </Col>
      </Row>
    </Form>
	);
}

class Payment extends React.Component<{}, {type: string, cats: catcomData[], coms: catcomData[]}> {
	constructor(props: any) {
		super(props)

    let cat: catcomData[] = []
    let com: catcomData[] = []

    g.call("get_cat", {}).then(async res => {
      //console.log(res);
      const data = await JSON.parse(res);

      data.forEach((itm: any) => {
        cat.push([itm.id, itm.name, itm.descrip])
      })
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    g.call("get_com", {}).then(async res => {
      //console.log(res);
      const data = await JSON.parse(res);

      data.forEach((itm: any) => {
        com.push([itm.id, itm.name, itm.descrip])
      })
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    this.state = {type: 'oneTime', cats: cat, coms: com};
	}

	pickPayment() {
		switch(this.state.type) {
			case 'oneTime': {return (<OneTime cats={this.state.cats} coms={this.state.coms}/>)}
			case 'recurring': {return (<Recurring cats={this.state.cats} coms={this.state.coms}/>)}
      case 'cat': {return (<CatOrCom cat={true}/>)}
      case 'com': {return (<CatOrCom cat={false}/>)}
      case 'income': {return (<Income coms={this.state.coms} />)}
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
            <Dropdown.Item active={this.state.type === 'cat'} eventKey='cat'>Category</Dropdown.Item>
            <Dropdown.Item active={this.state.type === 'com'} eventKey='com'>Company</Dropdown.Item>
            <Dropdown.Item active={this.state.type === 'income'} eventKey='income'>Income</Dropdown.Item>
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
