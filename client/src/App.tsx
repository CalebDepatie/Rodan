import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, Footer, Home, Payment } from './components';

function App(props: any) {
	return (
	<div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/payment" exact component={() => <Payment />} />
        </Switch>
        <Footer />
      </Router>
    </div>
	);
}

export default App;