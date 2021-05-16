import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form'

type catcomData = [number, string, string];

class Recurring extends React.Component<{}, {cat: number, com: number, name: string, price: number, start_date: Date, end_date: Date}> {
	constructor(props: any) {
		super(props)

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(evt: any) {
		const target = evt.target
		const value  = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name

		this.setState<never>({[name]: value}, this.render)
	}

	async handleSubmit(evt: any) {
		evt.preventDefault();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Origin': 'home' },
        body: JSON.stringify(this.state)
    };

    await fetch('localhost:8081/newrecur', requestOptions)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          return Promise.reject(res.status);
        }
      })
      .catch(error => {
        console.error('Error Sending Payment', error);
      });
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Category:
					<input
						name='cat'
						type='number'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Company:
					<input
						name='com'
						type='number'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Item Name:
					<input
						name='name'
						type='text'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Price:
					<input
						name='price'
						type='number'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Start Date:
					<input
						name='start_date'
						type='date'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					End Date (If Applicable):
					<input
						name='end_date'
						type='date'
						onChange={this.handleChange}
					/>
				</label>
				<input type='submit' value='Submit' />
			</form>
		);
	}
}


class OneTime extends React.Component<{}, {cat: number, com: number, name: string, price: number, date: Date}> {
	constructor(props: any) {
		super(props)

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(evt: any) {
		const target = evt.target
		const value  = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name

		this.setState<never>({[name]: value}, this.render)
	}

	handleSubmit(evt: any) {
		evt.preventDefault();

	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Category:
					<input
						name='cat'
						type='number'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Company:
					<input
						name='com'
						type='number'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Item Name:
					<input
						name='name'
						type='text'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Price:
					<input
						name='price'
						type='number'
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Date:
					<input
						name='date'
						type='date'
						onChange={this.handleChange}
					/>
				</label>
				<input type='submit' value='Submit' />
			</form>
		);
	}
}

class Payment extends React.Component<{}, {type: string, cats: catcomData[], coms: catcomData[]}> {
	constructor(props: any) {
		super(props)

		this.handleChange = this.handleChange.bind(this)

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
        console.log(data)
      })
      .catch(error => {
        console.error('Error Getting Data', error);
      });

    this.state = {type: 'oneTime', cats: cat, coms: com}
	}

	handleChange(evt: any) {
		this.setState<never>({type: evt.target.value}, this.render)
	}

	pickPayment() {
		switch(this.state.type) {
			case 'oneTime': {return (<OneTime />)}
			case 'recurring': {return (<Recurring />)}
		}
	}

	render() {
		return (
		<div className="home">
		  <div className="container">
			<div className="row align-items-center my-5">
			  <div className="col-lg-5">
				<h1 className="font-weight-light">Add Finance Data</h1>
				<Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
					  Record Type:
          </Dropdown.Toggle>
          <Dropdown.Menu onSelect={this.handleChange}>
            <Dropdown.Item eventKey='recurring'>Recurring</Dropdown.Item>
            <Dropdown.Item eventKey='oneTime'>One Time</Dropdown.Item>
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
