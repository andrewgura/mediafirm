import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button, ListGroupItem } from 'react-bootstrap';

class Adduser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selected: 0
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/users');

    await response.json().then(data => {

      var users = [];
      data.data.map(item => {
          users.push(<ListGroupItem onClick={this.selectUser.bind(this, item)}>{item.firstname} {item.lastname}</ListGroupItem>)
      })

      this.setState({users: users});
    })
  }

  selectUser(item){
    this.setState({selected: item.userid})
  }

  modalClose() {
   this.setState({ showModal: false });
   this.props.onResultChange();
 }

 async addUser(e){
   e.preventDefault();

   var body = {
     groupid: this.props.groupid,
     userid: this.state.selected
   }

  await fetch('/api/users', {
   method: 'POST',
   body: JSON.stringify(body),
   headers: {
     'Content-Type': 'application/json'
     }
   })
   this.props.onResultChange();
 }

  render() {
    const { users } = this.state;
    return (
      <Modal show={this.props.showCreate} onHide={this.modalClose.bind(this)}>
        <Modal.Header closeButton>
         <Modal.Title>{this.props.group} Add User</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <div className="permissionList">
           {users}
         </div>
         <Button bsStyle="primary" type="submit" onClick={this.addUser.bind(this)}>Add</Button>
         <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
     </Modal.Body>
    </Modal>
    );
  }
}

export default Adduser;
