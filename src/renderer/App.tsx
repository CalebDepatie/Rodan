import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Header, Footer } from './Components'
import { ToastContainer } from 'react-toastify'
import { Home, ProjectTable, Boards, Tasks, PageContainer, FinanceDashboard } from './Modules'
import { BrowserWindow } from 'electron'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeflex/primeflex.css'
import 'react-toastify/dist/ReactToastify.min.css'

import '@fortawesome/fontawesome-free/css/all.min.css'
import 'primeicons/primeicons.css'

import './style.scss'

declare global {
  interface Array<T> {
    groupBy(key: string): Array<T>;
    nestedFilter(cond: (item: T) => boolean): Array<T>;
  }
}

function App() {

  // set up Modules
  const modules = [
    {
      path: '/',
      name: 'Home',
      el: <Home/>,
      display: false,
    },
    {
      path:'/projects',
      name: 'Projects',
      el: <ProjectTable/>,
      modules: [
        {
          name: 'Boards',
          path: '/boards',
          el: <Boards/>,
        },
        {
          name: 'Tasks',
          path: '/tasks',
          el: <Tasks/>,
        },
      ]
    },
    {
      name: 'Finances',
      path:'/finances',
      el: <FinanceDashboard/>,
    },
    {
      name: 'Pages',
      path:'/documentation',
      el: <PageContainer/>,
    },
  ]

  const moduleToRoute = (module: any) => {
    return {
      path: module.path,
      element: module.el,
      exact: module.exact ?? true,
    }
  }

  // converts an array of modules to an array of routes
  const linearize = (modules: any[]) => {
    let routes: any[] = []

    modules.forEach((module) => {
        if (module.el) {
          routes.push(moduleToRoute(module))
        }

        if (module.modules) {
          const subroutes = linearize(module.modules)
          subroutes.map(route => route.path = module.path + route.path)

          routes = routes.concat(subroutes)          
        }
    })
    
    return routes
  }

  const routes = useMemo(() => linearize(modules), [])

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
        <Header modules={modules} />
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
