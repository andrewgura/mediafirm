import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, NavItem, Nav } from 'react-bootstrap';

class NavBarHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem className="navitem" componentClass={Link} href={'/mediamarkets/'} to={{ pathname: '/mediamarkets/'}}>Reserved Media Buys</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default NavBarHome;
