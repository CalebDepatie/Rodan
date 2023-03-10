import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNest from "./headerNest";
import { useMemoryStorage } from '../../Hooks'

import "./header.scss";

function Header(props: {}) {
  const { value: loggedIn } = useMemoryStorage("login", false)

	return (
    <div className="r-header">
      <Link to="/" id="title" >Project Singular Point</Link>

      <div className="header-right">
      { // todo: generate dynamically
        (loggedIn) ?
        <>
          <HeaderNest header={<Link to="/projects/raw">Projects</Link>}>
            <Link to="/projects/boards">Boards</Link>
            <Link to="/projects/tasks">Tasks</Link>
          </HeaderNest>

          <Link to="/finances/dashboard">Finances</Link>
          <Link to="/documentation">Pages</Link>
        </>
        : null
      }
      </div>
    </div>
	);
}

export default Header;
