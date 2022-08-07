import React, { useMemo } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Header, Footer } from './Components';
import { ToastContainer } from 'react-toastify';
import { Home, ProjectTable, Boards, Tasks, PageContainer, FinanceDashboard } from './Modules';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'react-toastify/dist/ReactToastify.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
        element: <Home/>,
        exact: true,
      },
      {
        path:'/projects/raw',
        element: <ProjectTable/>,
        exact: true,
      },
      {
        path:'/projects/boards',
        element: <Boards/>,
        exact: true,
      },
      {
        path:'/projects/tasks',
        element: <Tasks/>,
        exact: true,
      },
      {
	      path:'/finances/dashboard',
	      element: <FinanceDashboard/>,
	      exact: true,
      },
      {
        path:'/documentation',
        element: <PageContainer/>,
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
        <div className="r-content-window">
          <Routes>
            {routes.map((route, i) => (
              <Route key={i} {...route} />
            ))}
          </Routes>
        </div>
        <Footer />

        <ToastContainer position="top-right" autoClose={5000} rtl={false} theme='dark'
          hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover />
      </Router>
    </div>
    </>
	);
}

export default App;
