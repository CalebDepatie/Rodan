import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, Footer } from './Components';
import { Home, Payment, RawData, ProjectTable } from './Modules';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

function App() {
  const routes = useMemo(() => [
      {
        path: '/',
        component: Home,
        exact: true,
      },
      {
        path:'/projects/raw',
        component: ProjectTable,
        exact: true,
      },
      {
        path:'/finances/raw',
        component: RawData,
        exact: true,
      },
      {
        path:'/finances/payments',
        component: Payment,
        exact: true,
      },
  ], []);


	return (
	<div className="App">
      <Router>
        <Header />

        <Switch>
          {routes.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </Switch>
        <Footer />
      </Router>
    </div>
	);
}

export default App;
