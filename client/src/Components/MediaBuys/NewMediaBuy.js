import React, { Component } from "react";
import NewSpender from '../Spenders/NewSpender';
import NewAd from "../Ads/NewAd";
import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button, Radio } from 'react-bootstrap';

class NewMediaMarket extends Component {
 constructor(props) {
   super(props);
   this.state = {
      showModal: this.props.showCreate,
      ads: [],
      spenders: [],
      total: '',
      status: '',
      start: '',
      end: '',
      spenderid: 0,
      type: '',
      ad: 0,
      openNewSpender: false,
      openNewAd: false
   }
 }

 async componentDidMount() {
   const response = await fetch('/api/spenders' + this.props.districtid);
   await response.json().then(data => {

   let spenders = data.spenders.map(item => {
       return(
         <option key={item.spenderid} value={item.spenderid}>{item.spender}</option>
       )
     })
     spenders.unshift(<option></option>)
     this.setState({spenders: spenders});
   })



   const getAds = await fetch('/api/districtads' + this.props.districtid);
   await getAds.json().then(data => {

     let ads = data.ads.map((item, i) => {

       return (
         <option key={item.adid} value={item.adid}>{item.description}</option>
       )
     })
      ads.unshift(<option></option>);
      this.setState({ads: ads});
   })
 }

 modalClose() {
  this.setState({ showModal: false });
  this.props.onResultChange();
}

async createMediaBuy(e) {
  e.preventDefault();

  var body = {
    districtid: this.props.districtid,
    status: this.state.status,
    total: this.state.total,
    start: this.state.start,
    end: this.state.end,
    ad: this.state.ad,
    spenderid: this.state.spenderid,
    type: this.state.type,
    marketid: this.props.marketid
  }
  await fetch('/api/mediabuys', {
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

openNewSpender(e){
  e.preventDefault();
  this.setState({openNewSpender: true})
}

closeNewSpender() {
  this.setState({openNewSpender: false});
  this.componentDidMount();
}

openNewAd(e){
  e.preventDefault();
  this.setState({openNewAd: true})
}

closeNewAd() {
  this.setState({openNewAd: false});
  this.componentDidMount();
}

 render() {
   return (
     <Modal show={this.props.showCreate} onHide={this.modalClose.bind(this)}>
       <Modal.Header closeButton>
        <Modal.Title>New Media Buy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={this.createMediaBuy.bind(this)}>
      <FormGroup>

      <Row>
        <Col lg={12}><ControlLabel>Ad</ControlLabel>
        <button onClick={this.openNewAd.bind(this)} className="btn btn-xs btn-success newSpenderBtn">New Ad</button>
        <FormControl name="ad" componentClass="select" onChange={this.handleChange.bind(this)}>
            {this.state.ads}
          </FormControl></Col>
      </Row>

        <Row>
          <Col lg={6}>  <ControlLabel>Start Date</ControlLabel>
        <FormControl required name="start" type="date" onChange={this.handleChange.bind(this)}/></Col>

        <Col lg={6}>  <ControlLabel>End Date</ControlLabel>
        <FormControl required name="end" type="date" onChange={this.handleChange.bind(this)}/></Col>
        </Row>

        <Row>
          <Col lg={12}>  <ControlLabel>Spender</ControlLabel>
          <button onClick={this.openNewSpender.bind(this)} className="btn btn-xs btn-success newSpenderBtn">New Spender</button>
        <FormControl name="spenderid" componentClass="select" onChange={this.handleChange.bind(this)}>
            {this.state.spenders}
          </FormControl>
         </Col>
        </Row>

        <Row>
          <Col lg={12}>  <ControlLabel>Election Type</ControlLabel>
          <Row><Col lg={6}><Radio name="type" value="General" onChange={this.handleChange.bind(this)} inline>General</Radio></Col></Row>
          <Row><Col lg={6}><Radio name="type" value="Primary" onChange={this.handleChange.bind(this)} inline>Primary</Radio></Col></Row>
         </Col>
        </Row>

        <Button bsStyle="primary" type="submit">Create</Button>
        <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
      </FormGroup>
      </form>
    </Modal.Body>
    {this.state.openNewSpender && <NewSpender districtid={this.props.districtid} showCreate={this.state.openNewSpender} onResultChange={this.closeNewSpender.bind(this)}/>}
    {this.state.openNewAd && <NewAd districtid={this.props.districtid} showCreate={this.state.openNewAd} onResultChange={this.closeNewAd.bind(this)}/>}
   </Modal>
   );
 }
}

export default NewMediaMarket;
