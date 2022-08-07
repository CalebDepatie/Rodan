import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNest from "./headerNest";

import "./header.scss";

function Header(props: {}) {
	return (
    <div className="r-header">
      <Link to="/" id="title" >Project Singular Point</Link>

      <div className="header-right">
        <HeaderNest header={<Link to="/projects/raw">Projects</Link>}>
          <Link to="/projects/boards">Boards</Link>
          <Link to="/projects/tasks">Tasks</Link>
        </HeaderNest>

	      <Link to="/finances/dashboard">Finances</Link>
        <Link to="/documentation">Pages</Link>
      </div>
    </div>
	);
}

export default Header;
