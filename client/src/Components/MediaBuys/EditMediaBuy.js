import React, { Component } from "react";
import NewSpender from '../Spenders/NewSpender'
import { Modal, FormGroup, ControlLabel, FormControl,Col, Row, Button } from 'react-bootstrap';

class EditMediaBuy extends Component {
 constructor(props) {
   super(props);
   this.state = {
      showModal: this.props.showEdit,
      spenders: [],
      ads: [],
      start: '',
      end: '',
      spenderid: this.props.spenderid.toString(),
      adid: this.props.currentad,
      openNewSpender: false
   }
 }

 async componentDidMozunt() {
   const response = await fetch('/api/mediabuy' + this.props.id);
   const data = await response.json();

   this.setState({
     start: data.mediabuys[0].startdate,
     end: data.mediabuys[0].enddate
   })

   const getSpenders = await fetch('/api/spenders' + this.props.spenderid + "/district" + this.props.districtid);
   await getSpenders.json().then(data => {
   let spenders = data.spenders.map(item => {
       return(
         <option key={item.spenderid} value={item.spenderid}>{item.spender}</option>
       )
     })
     this.setState({spenders: spenders});
   })

   const getAds = await fetch('/api/ads' + this.props.currentad + "/district" + this.props.districtid);
   await getAds.json().then(data => {
   let ads = data.ads.map(item => {
       return(
         <option key={item.adid} value={item.adid}>{item.description}</option>
       )
     })
     this.setState({ads: ads});
   })


 }

modalClose() {
  this.setState({ showModal: false });
  this.props.onResultChange();
}

handleInputChange(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({[name]: value});
}

submitEdit(e) {
  e.preventDefault();
  var body = {
    spenderid: this.state.spenderid,
    adid: this.state.adid
  }

  fetch('/api/mediabuys' + this.props.id, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  this.props.onResultChange();
}

openNewSpender(e){
  e.preventDefault();
  this.setState({openNewSpender: true})
}

closeNewSpender() {
  this.setState({openNewSpender: false});
  this.componentDidMount();
}

 render() {
   return (
     <Modal show={this.props.showEdit} onHide={this.modalClose.bind(this)}>
       <Modal.Header closeButton>
        <Modal.Title>Edit Media Buy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={this.submitEdit.bind(this)}>
      <FormGroup>

      <Row>
      <Col lg={12}><ControlLabel>AD</ControlLabel>
        <FormControl name="adid" componentClass="select" onChange={this.handleInputChange.bind(this)}>
        {this.state.ads}
        </FormControl></Col>
      </Row>


      <Row>
        <Col lg={6}>  <ControlLabel>Start Date</ControlLabel>
        <FormControl disabled name="start" value={this.state.start} onChange={this.handleInputChange.bind(this)}/></Col>

        <Col lg={6}>  <ControlLabel>End Date</ControlLabel>
        <FormControl disabled name="end" value={this.state.end} onChange={this.handleInputChange.bind(this)}/></Col>
      </Row>

      <Row>
        <Col lg={12}>  <ControlLabel>Spender</ControlLabel>
        <button onClick={this.openNewSpender.bind(this)} className="btn btn-xs btn-success newSpenderBtn">New Spender</button>
        <FormControl name="spenderid" componentClass="select" onChange={this.handleInputChange.bind(this)}>
          {this.state.spenders}
        </FormControl>
       </Col>
      </Row>

        <Button bsStyle="primary" type="submit">Update</Button>
        <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
      </FormGroup>
      </form>
    </Modal.Body>
      {this.state.openNewSpender && <NewSpender showCreate={this.state.openNewSpender} onResultChange={this.closeNewSpender.bind(this)}/>}
   </Modal>
   );
 }
}

export default EditMediaBuy;
