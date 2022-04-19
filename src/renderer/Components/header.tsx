import React from 'react';
import { Link, withRouter} from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

function Header(props: any) {
	return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/index.html">Project Singular Point</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav>
          <NavDropdown title="Projects" id="collasible-nav-dropdown">
            <NavDropdown.Item href="/projects/raw">Overview</NavDropdown.Item>
            <NavDropdown.Item href="/projects/boards">Boards</NavDropdown.Item>
            <NavDropdown.Item href="/projects/tasks">Tasks</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <NavDropdown title="Finances" id="collasible-nav-dropdown">
            <NavDropdown.Item href="/finances/overview">Overview</NavDropdown.Item>
            {/*<NavDropdown.Item href="/finances/raw">Raw Data</NavDropdown.Item>*/}
            <NavDropdown.Item href="/finances/payments">Payments</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Item>
            <Nav.Link title="Pages" href="/documentation">
              Pages
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
	);
}

export default withRouter(Header);
