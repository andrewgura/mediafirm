import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button, ListGroupItem } from 'react-bootstrap';

class AddGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  modalClose() {
   this.setState({ showModal: false });
   this.props.onResultChange();
 }

 handleChange(event){
   const target = event.target;
   const value = target.value;
   const name = target.name;
   this.setState({[name]: value});
 }

 async addGroup(e){
   e.preventDefault();

   var body = {
     name: this.state.name
   }

  await fetch('/api/group', {
   method: 'POST',
   body: JSON.stringify(body),
   headers: {
     'Content-Type': 'application/json'
     }
   })
   this.props.onResultChange();
 }

  render() {
    const { districts } = this.state;
    return (
      <Modal show={this.props.showCreate} onHide={this.modalClose.bind(this)}>
        <Modal.Header closeButton>
         <Modal.Title>{this.props.group} Add Group</Modal.Title>
       </Modal.Header>
       <Modal.Body>

         <Row>
         <Col lg={10}><ControlLabel>Group Name</ControlLabel>
         <FormControl required name="name" type="text" onChange={this.handleChange.bind(this)}/></Col>
       </Row>

       <Row>
         <Col lg={10}>
         <Button bsStyle="primary" type="submit" onClick={this.addGroup.bind(this)}>Add</Button>
         <Button onClick={() => this.props.onResultChange()}>Cancel</Button></Col>
       </Row>
     </Modal.Body>
    </Modal>
    );
  }
}

export default AddGroup;
