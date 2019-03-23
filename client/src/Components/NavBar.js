import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, NavItem, Nav } from 'react-bootstrap';

class NavBar extends Component {
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
            <span>{this.props.firm}</span>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem className="navitem" componentClass={Link} href={'/district/mediabuys/' + this.props.districtid} to={{ pathname: '/district/mediabuys/' + this.props.districtid}}>Media Buys</NavItem>
          <NavItem className="navitem" componentClass={Link} href={'/district/spots/' + this.props.districtid} to={{ pathname: '/district/spots/' + this.props.districtid}}>Spots</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default NavBar;
