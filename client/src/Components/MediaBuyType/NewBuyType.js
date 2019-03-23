import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button } from 'react-bootstrap';

class NewBuyType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediamarkets: [],
      showModal: "",
      scheduletype: "",
      mediatype: "",
      marketid: 1,
      total: ""

    }
  }

  async componentDidMount() {
    const response = await fetch('/api/mediamarkets');
    await response.json().then(data => {
    let mediamarkets = data.mediamarkets.map(item => {
        return(
          <option key={item.marketid} value={item.marketid}>{item.market}</option>
        )
      })
      this.setState({mediamarkets: mediamarkets});
    })
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

 async createMediaBuyType(e){
   e.preventDefault();

   var body = {
     mediabuyId: this.props.id,
     scheduletype: this.state.scheduletype,
     mediatype: this.state.mediatype,
     marketid: this.state.marketid,
     total: this.state.total
   }

  await fetch('/api/mediabuytype', {
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
         <Modal.Title>New Buy Type</Modal.Title>
       </Modal.Header>
       <Modal.Body>
       <form onSubmit={this.createMediaBuyType.bind(this)}>
       <FormGroup>

       <Row>
         <Col lg={6}><ControlLabel>Total</ControlLabel>
         <FormControl required name="total" type="number" onChange={this.handleChange.bind(this)}/></Col>

         <Col lg={6}><ControlLabel>Media Type</ControlLabel>
         <FormControl required name="mediatype" type="text" onChange={this.handleChange.bind(this)}/></Col>
       </Row>

       <Row>
         <Col lg={6}><ControlLabel>Market</ControlLabel>
         <FormControl name="marketid" componentClass="select" onChange={this.handleChange.bind(this)}>
             {this.state.mediamarkets}
           </FormControl></Col>
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

export default NewBuyType;
