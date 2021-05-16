import React from 'react';
import { Link, withRouter} from 'react-router-dom';

function Header(props: any) {
	return (
	<div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Personal Home Page
          </Link>

          <div>
            <ul className="navbar-nav ml-auto">
              <li
                className={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li
                className={`nav-item  ${
                  props.location.pathname === "/payment" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/payment">
                  Finance Data
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
	);
}

export default withRouter(Header);
