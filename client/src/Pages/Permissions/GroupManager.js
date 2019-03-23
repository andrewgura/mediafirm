import React, { Component } from "react";
import { ListGroup, ListGroupItem, Col } from 'react-bootstrap';
import GroupUsers from "./GroupUsers"
import GroupDistricts from "./GroupDistricts"
import Adduser from "./Adduser"
import AddDistrict from "./AddDistrict"
import AddGroup from "./AddGroup"

class GroupManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      groupid: 0,
      currentgroup: '',
      openAdduser: false,
      openAddDistrict: false,
      openAddGroup: false
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/permissions');

    await response.json().then(data => {
    let groups = data.data.map((item, i) => {
      if(i != 0) {//First result is Admin group, build differently to avoid districts column
        return(
          <Col md={4}>
            <div>
              <h2>{item.groupname}</h2>
              <span>Users</span><span>Districts</span>
            </div>
              <div style={{display: "inline-flex"}}>
                <ListGroup className="permissionList">
                  <GroupUsers group={item.groupid}/>
                </ListGroup>
            </div>
            <div style={{display: "inline-flex"}}>
              <ListGroup className="permissionList">
                <GroupDistricts group={item.groupid}/>
              </ListGroup>
          </div>
          <p><button onClick={this.openAddUser.bind(this, item)}>Add User</button>
        <button onClick={this.openAddDistrict.bind(this, item)}>Add District</button></p>
        </Col>
        )
      } else { // build AdminGroup
        return(
          <Col md={4}>
          <div>
            <div>
              <h2>{item.groupname}</h2>
              <span>Users</span>
            </div>
              <div style={{display: "inline-flex"}}>
                <ListGroup className="permissionList">
                  <GroupUsers group={item.groupid}/>
                </ListGroup>
            </div>
          </div>
          <p><button onClick={this.openAddUser.bind(this, item)}>Add User</button></p>
        </Col>
        )
      }
      })

      this.setState({groups: groups});
    })
  }

  openAddUser(item, e){
    e.preventDefault();
    this.setState({groupid: item.groupid, currentgroup: item.groupname, openAdduser: true})
  }

  closeAddUser() {
    this.setState({openAdduser: false});
    this.componentDidMount();
  }

  openAddDistrict(item, e){
    e.preventDefault();
    this.setState({groupid: item.groupid, currentgroup: item.groupname, openAddDistrict: true})
  }

  closeAddDistrict() {
    this.setState({openAddDistrict: false});
    this.componentDidMount();
  }

  openAddGroup(e){
    e.preventDefault();
    this.setState({openAddGroup: true})
  }

  closeAddGroup() {
    this.setState({openAddGroup: false});
    this.componentDidMount();
  }

  render() {
    return (
      <div>
        <button onClick={this.openAddGroup.bind(this)} style={{display: "block"}}>New Group</button>
        {this.state.groups}
        {this.state.openAdduser && <Adduser groupid={this.state.groupid} group={this.state.currentgroup} showCreate={this.state.openAdduser} onResultChange={this.closeAddUser.bind(this)}/>}
        {this.state.openAddDistrict && <AddDistrict groupid={this.state.groupid} group={this.state.currentgroup} showCreate={this.state.openAddDistrict} onResultChange={this.closeAddDistrict.bind(this)}/>}
        {this.state.openAddGroup && <AddGroup showCreate={this.state.openAddGroup} onResultChange={this.closeAddGroup.bind(this)}/>}
      </div>
    );
  }
}

export default GroupManager;
