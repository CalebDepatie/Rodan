import React, { useState } from 'react';
import g from 'guark';

import { Button, InputText, Dropdown } from '../../Components';
//import { Dropdown } from 'primereact/dropdown';

type catcomData = [number, string, string];

interface MetaData {
  cats: {label:string, value:number}[];
  coms: {label:string, value:number}[];
}

function Recurring(props: MetaData) {
  const [ form, setForm ] = useState<any>({});

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
    <div className='r-form'>
      <div className="r-field r-col-6">
        <label htmlFor="name">Name</label>
        <InputText id="name" type="text" value={form?.name}
          onChange={e => setField('name', e.target.value) }/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="price">Price</label>
        <InputText id="price" type="text" value={form?.price}
          onChange={e => setField('price', +e.target.value) }/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="com">Company</label>
        <Dropdown id="com" value={form?.com} options={props.coms}
          onChange={e => setField('com', +e.target.value)} />
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="com">Category</label>
        <Dropdown id="com" value={form?.cat} options={props.cats}
          onChange={e => setField('cat', +e.target.value)} />
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="start">Start Date</label>
        <InputText id="start" type="date" value={form?.date}
          onChange={e => setField('start_date', e.target.value) }/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="end">End Date</label>
        <InputText id="end" type="date" value={form?.date}
          onChange={e => setField('end_date', e.target.value) }/>
      </div>

      <div className="r-field r-col-12">
        <Button label='Clear' onClick={() => setForm({})} />
        <Button label='Submit' onClick={handleSubmit} />
      </div>
    </div>
	);
}


function OneTime(props: MetaData) {
  const [ form, setForm ] = useState<any>({});

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
    <div className='r-form'>
      <div className="r-field r-col-6">
        <label htmlFor="name">Name</label>
        <InputText id="name" type="text" value={form?.name}
          onChange={e => setField('name', e.target.value) }/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="price">Price</label>
        <InputText id="price" type="number" value={form?.price}
          onChange={e => setField('price', +e.target.value) }/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="com">Company</label>
        <Dropdown id="com" value={form?.com} options={props.coms}
          onChange={e => setField('com', +e.target.value)} />
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="com">Category</label>
        <Dropdown id="com" value={form?.cat} options={props.cats}
          onChange={e => setField('cat', +e.target.value)} />
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="date">Date</label>
        <InputText id="date" type="date" value={form?.date}
          onChange={e => setField('date', e.target.value) }/>
      </div>

      <div className="r-field r-col-12">
        <Button label='Clear' onClick={() => setForm({})} />
        <Button label='Submit' onClick={handleSubmit} />
      </div>
    </div>
	);
}

function CatOrCom(props: any) {
  const [ form, setForm ] = useState<any>({});

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
    <div className='r-form'>
      <div className="r-field r-col-6">
        <label htmlFor="name">Name</label>
        <InputText id="name" type="text" value={form?.name}
          onChange={e => setField('name', e.target.value) }/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="descrip">Description</label>
        <InputText id="descrip" type="text" value={form?.descrip}
          onChange={e => setField('descrip', e.target.value) }/>
      </div>

      <div className="r-field r-col-12">
        <Button label='Clear' onClick={() => setForm({})} />
        <Button label='Submit' onClick={handleSubmit} />
      </div>
    </div>
	);
}

function Income(props: any) {
  const [ form, setForm ] = useState<any>({});

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
    <div className="r-form">
      <div className="r-field r-col-6">
        <label htmlFor="name">Name</label>
        <InputText id="name" type="text" value={form?.name}
          onChange={e => setField('name', e.target.value) }/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="price">Amount</label>
        <InputText id="price" type="text" value={form?.price}
          onChange={e => setField('price', +e.target.value) }/>
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="com">Company</label>
        <Dropdown id="com" value={form?.com} options={props.coms}
          onChange={e => setField('com', +e.target.value)} />
      </div>

      <div className="r-field r-col-6">
        <label htmlFor="date">Date</label>
        <InputText id="date" type="date" value={form?.date}
          onChange={e => setField('date', e.target.value) }/>
      </div>

      <div className="r-field r-col-12">
        <Button label='Clear' onClick={() => setForm({})} />
        <Button label='Submit' onClick={handleSubmit} />
      </div>
    </div>
	);
}

class Payment extends React.Component<{}, {type: string, cats: {label:string, value:number}[]
  , coms: {label:string, value:number}[]}> {
	constructor(props: any) {
		super(props)

    let cat: catcomData[] = [];
    let com: catcomData[] = [];

    g.call("get_cat", {}).then(async res => {
      //console.log(res);
      const data = await JSON.parse(res);

      data.forEach((itm: any) => {
        cat.push([itm.id, itm.name, itm.descrip])
      });

      this.state = {
        ...this.state,
        cats: cat.map((itm:catcomData, i:number) => ({label: itm[1], value: i+1})),
      };
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    g.call("get_com", {}).then(async res => {
      //console.log(res);
      const data = await JSON.parse(res);

      data.forEach((itm: any) => {
        com.push([itm.id, itm.name, itm.descrip])
      });

      this.state = {
        ...this.state,
        coms: com.map((itm:catcomData, i:number) => ({label: itm[1], value: i+1})),
      };
    }).catch(error => {
      console.error('Error Getting Data', error);
    });

    this.state = {
      ...this.state,
      type: 'oneTime',
    };
	}

  options = [
      {label: 'Recurring', value: 'recurring'},
      {label: 'One Time', value: 'oneTime'},
      {label: 'Category', value: 'cat'},
      {label: 'Company', value: 'com'},
      {label: 'Income', value: 'income'},
  ];

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
          <Dropdown value={this.state.type} options={this.options}
            onChange={(e:any) => this.setState({...this.state, type: e.target.value})} />
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
