import React, { Component } from "react";

import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button, Radio} from 'react-bootstrap';

class NewClient extends Component {
 constructor(props) {
   super(props);
   this.state = {
      showModal: this.props.showCreate,
      type: '',
      date: '',
      client: '',
      firm: ''
   }
 }



 modalClose() {
  this.setState({ showModal: false });
  this.props.onResultChange();
}

async createMediaBuy(e) {
  e.preventDefault();

  var body = {
    type: this.state.type,
    date: this.state.date,
    client: this.state.client,
    firm: this.state.firm
  }

  await fetch('/api/clients', {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json'
    }
  })
  this.props.onResultChange();
}

handleChange(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({[name]: value});
}

 render() {
   return (
     <Modal show={this.props.showCreate} onHide={this.modalClose.bind(this)}>
       <Modal.Header closeButton>
        <Modal.Title>New Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={this.createMediaBuy.bind(this)}>
      <FormGroup>

        <Row>
          <Col lg={12}><ControlLabel>Firm</ControlLabel></Col>
          <Col lg={12}>
          <FormControl required name="firm" componentClass="select" onChange={this.handleChange.bind(this)}>
            <option></option>
            <option value="AL Media">AL Media</option>
            <option value="Adelstein & Associates">Adelstein & Associates</option>
            <option value="Amplify">Amplify</option>
          </FormControl></Col>
        </Row>

        <Row>
          <Col lg={12}><ControlLabel>Client Name</ControlLabel></Col>
          <Col lg={12}><FormControl required name="client" type="text" onChange={this.handleChange.bind(this)}/></Col>
        </Row>

        <Row>
          <Col lg={12}><ControlLabel>Election Date</ControlLabel></Col>
          <Col lg={12}><FormControl required name="date" type="date" onChange={this.handleChange.bind(this)}/></Col>
        </Row>

        <ControlLabel>Type</ControlLabel>
        <Row><Col lg={6}><Radio name="type" value="Primary" onChange={this.handleChange.bind(this)} inline>Primiary</Radio></Col></Row>
        <Row><Col lg={6}><Radio name="type" value="General" onChange={this.handleChange.bind(this)} inline>General</Radio></Col></Row>


        <Button bsStyle="primary" type="submit">Create</Button>
        <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
      </FormGroup>
      </form>
    </Modal.Body>
   </Modal>
   );
 }
}

export default NewClient;
