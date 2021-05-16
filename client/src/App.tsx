import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, Footer, Home, Payment } from './components';

function App(props: any) {
	return (
	<div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={() => <Home />} />
          <Route exact path="/payment" component={() => <Payment />} />
        </Switch>
        <Footer />
      </Router>
    </div>
	);
}

export default App;
