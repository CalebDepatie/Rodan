import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNest from "./headerNest";
import { useMemoryStorage } from '../../Hooks'

import "./header.scss";

function Header(props: {modules: any[]}) {
  const { value: loggedIn } = useMemoryStorage("login", false)

  const generateHeaderRoutes = (modules: any[], prefix?: string) => {
    let headerRoutes:any[] = []
    prefix ??= ""

    modules.forEach((module) => {
      if (module.display !== false && !module.modules) {
        headerRoutes.push(<>
          <Link key={prefix + module.path} to={prefix + module.path}>{module.name}</Link>
        </>)
      }

      if (module.modules) {
        const subheader = generateHeaderRoutes(module.modules, prefix + module.path)
        
        if (module.display !== false) {
          var header = <Link key={prefix + module.path} to={prefix + module.path}>
            {module.name}
          </Link>
        }

        headerRoutes.push(
          <HeaderNest key={prefix + module.path} header={header}>
            {subheader}
          </HeaderNest>
        )
      }
    })

    return headerRoutes
  }

  const show_modules = loggedIn || process.env.NODE_ENV !== 'production';

	return (
    <div className="r-header">
      <Link to="/" id="title" >Project Singular Point</Link>

      <div className="header-right">
      {
        (show_modules) ?
          generateHeaderRoutes(props.modules)
        : null
      }
      </div>
    </div>
	);
}

export default Header;
