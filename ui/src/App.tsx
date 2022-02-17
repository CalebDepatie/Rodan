import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header, Footer } from './Components';
import { ToastContainer } from 'react-toastify';
import { Home, Payment, RawData, ProjectTable, FinanceReview, Boards, Tasks, PageContainer } from './Modules';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'react-toastify/dist/ReactToastify.min.css';

import 'primeicons/primeicons.css';

import './style.scss';

declare global {
  interface Array<T> {
    groupBy(key: string): Array<T>;
    nestedFilter(cond: (item: T) => boolean): Array<T>;
  }
}

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
        path:'/projects/boards',
        component: Boards,
        exact: true,
      },
      {
        path:'/projects/tasks',
        component: Tasks,
        exact: true,
      },
      {
        path:'/finances/overview',
        component: FinanceReview,
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
      {
        path:'/documentation',
        component: PageContainer,
        exact: true,
      }
  ], []);


  // Additional member functions
  if (!Array.prototype.groupBy) {
    Object.defineProperty(Array.prototype, 'groupBy', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function(key: string) {
        return this.reduce(function(rv:any, x:any) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      }
    });
  }

  if (!Array.prototype.nestedFilter) {
    Object.defineProperty(Array.prototype, 'nestedFilter', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function(cond:(itm: any)=>boolean) {        
        return this.map((item:any) => item.children
          ? {...item, children: item.children.nestedFilter(cond) }
          : item
        ).filter(cond);
      }
    });
  }

	return (
  <>
	<div className="App">
      <Router>
        <Header />

        <Switch>
          {routes.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </Switch>

        <ToastContainer position="top-right" autoClose={5000} rtl={false} theme='dark'
          hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover />

        <Footer />
      </Router>
    </div>
    </>
	);
}

export default App;
