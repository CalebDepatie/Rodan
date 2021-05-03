import React from 'react';
import {newOnePayment, newRecurPayment} from '../database'

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
	
	handleSubmit(evt: any) {
		evt.preventDefault();
		newRecurPayment(this.state.cat, this.state.com, this.state.name, this.state.price, this.state.start_date, this.state.end_date).catch((err) => {
			console.error(err);
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
		newOnePayment(this.state.cat, this.state.com, this.state.name, this.state.price, this.state.date).catch((err) => {
			console.error(err);
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

class Payment extends React.Component<{}, {type: string}> {
	constructor(props: any) {
		super(props)
		this.state = {type: 'oneTime'};
		
		this.handleChange = this.handleChange.bind(this)
	}
	
	handleChange(evt: any) {		
		this.setState({type: evt.target.value}, this.render)
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
				<h1 className="font-weight-light">Add Pay Records</h1>
				<label>
					Payment Type:
					<select value={this.state.type} onChange={this.handleChange}>
						<option value='recurring'>Recurring</option>
						<option value='oneTime'>One Time</option>
					</select>
				</label>
				<div>{this.pickPayment()}</div>
			  </div>
			</div>
		  </div>
		</div>
		);
	}
}

export default Payment;