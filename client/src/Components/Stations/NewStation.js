import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button } from 'react-bootstrap';

class NewStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      affiliate: ""
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

 createNewSpender(e){
   e.preventDefault();

   var body = {
     name: this.state.name,
     affiliate: this.state.affiliate,
     type: this.props.type,
     market: this.props.market
   }

   fetch('/api/stations', {
   method: 'POST',
   body: JSON.stringify(body),
   headers: {
     'Content-Type': 'application/json'
     }
   })
   this.props.onResultChange();
 }

  render() {
    return (
      <Modal show={this.props.showCreate} onHide={this.modalClose.bind(this)}>
        <Modal.Header closeButton>
         <Modal.Title>New Station</Modal.Title>
       </Modal.Header>
       <Modal.Body>
       <form onSubmit={this.createNewSpender.bind(this)}>
       <FormGroup>

       <Row>
         <Col lg={6}><ControlLabel>Station Name</ControlLabel>
         <FormControl required name="name" type="text" onChange={this.handleChange.bind(this)}/></Col>

         <Col lg={6}><ControlLabel>Affiliate</ControlLabel>
         <FormControl required name="affiliate" type="text" onChange={this.handleChange.bind(this)}/></Col>
       </Row>


         <Button bsStyle="primary" type="submit">Create</Button>
         <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
       </FormGroup>
       </form>
     </Modal.Body>
    </Modal>
    );
  }
}

export default NewStation;
