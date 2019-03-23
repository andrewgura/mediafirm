import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button } from 'react-bootstrap';
import NewStation from '../Stations/NewStation';
var dateFormat = require('dateformat');

/* eslint-disable */

class NewBuyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: this.props.openEdit,
      amount: 0,
      cpp: 0,
      trps: 0,
      spots: 0,
      days: [],
      dates: [],
      stations: [],
      openNewStation: false
    }
  }

  async componentDidMount() {
    this.formatStartEnd()
    const getStations = await fetch('/api/stations' + this.props.market + '/type' + this.props.type);
    await getStations.json().then(data => {
    let stations = data.stations.map(item => {
        return(
          <option key={item.stationid} value={item.stationid}>{item.station}</option>
        )
      })
      /*Setting the inital stationsystemid to the first result from API because if the user wants to use the first result
      without selecting it, it won't set the state so the detail wont be created */
      stations.unshift(<option></option>);
      this.setState({stations: stations});
    })
  }

  modalClose() {
   this.setState({ showModal: false });
   this.props.onResultChange();
 }

 async handleChange(event){
   const target = event.target;
   const value = target.value;
   const name = target.name;
   await this.setState({[name]: value});
   this.props.type === "Broadcast" ? this.calcTrps() : null;
 }

 calcTrps() {
   var trp = this.state.amount / this.state.cpp;
   this.setState({trps: trp})
 }

async createMediaBuyType(e){
   e.preventDefault();

   var body = {
     mediabuytypeid: this.props.id,
     stationsystemid: this.state.stationsystemid,
     market: this.props.market,
     buyid: this.props.buyid,
     cpp: this.state.cpp,
     amount: this.state.amount,
     trps: this.state.trps,
     spots: this.state.spots,
     dates: this.state.dates
   }

   await fetch('/api/mediabuydetails', {
   method: 'POST',
   body: JSON.stringify(body),
   headers: {
     'Content-Type': 'application/json'
     }
   })
   this.props.onResultChange();
 }

 handlePercentChange(index, event) {
   const target = event.target;
   const value = target.value;
   const name = target.name;

   //create a copy of state dates to be able to manipulate the percents
   //assigned to each day
   var datesCopy = [...this.state.dates];
   datesCopy[index][name] = value;

   this.setState({dates: datesCopy})
 }

 formatStartEnd() {
   var { startdate, enddate } = this.props;

   //Format the start and end date into JavaScript Dates
   var partstart = startdate.split('-'); // eslint-disable-next-line
   var startdate = new Date(partstart[0], partstart[1] - 1, partstart[2]);

   var partsend = enddate.split('-'); // eslint-disable-next-line
   var enddate = new Date(partsend[0], partsend[1] - 1, partsend[2]);

   //Takes the difference of the days
   var timeDiff = Math.abs(startdate.getTime() - enddate.getTime());
   var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; //plus 1 to go through the enddate
   //days to be displayed on render
   var days = [];
   //dates array will be used to push into dates state to get all dates related to the mediabuy
   var dates = [];

   for(var i = 0; i < diffDays; i++) {  // eslint-disable-next-line
       var startdate = new Date(partstart[0], partstart[1] - 1, partstart[2]);
       startdate.setDate(startdate.getDate() + i);  // eslint-disable-next-line
       var startdate  = dateFormat(startdate,"yyyy-mm-dd");

       //Getting each date and pushing into dates array with a default of 100%
       var a = {[startdate]: "100"}
       dates.push(a);

       //Pushing HTML into days array to display on render
       days.push(
         <div key={i}>
          <h3>{startdate}</h3>
          <hr/>
          <input type="text" name={startdate} value={this.state.startdate} onChange={this.handlePercentChange.bind(this,i)}/>
       </div>)
   }
   //Days to be rendered onto screen, dates where each day is being store with their percents
    this.setState({days: days, dates: dates});
 }

 openNewStation(e){
   e.preventDefault();
   this.setState({openNewStation: true})
 }

 closeNewStation() {
   this.setState({openNewStation: false});
   this.componentDidMount();
 }

  render() {
    return (
      <Modal show={this.props.showCreate} onHide={this.modalClose.bind(this)}>
        <Modal.Header closeButton>
         <Modal.Title>New Buy Detail</Modal.Title>
       </Modal.Header>
       <Modal.Body>
       <form onSubmit={this.createMediaBuyType.bind(this)}>
       <FormGroup>

       <Row>
         <Col lg={6}><ControlLabel>Station</ControlLabel>
         <button onClick={this.openNewStation.bind(this)} className="btn btn-xs btn-success newSpenderBtn">New Station</button>
         <FormControl name="stationsystemid" componentClass="select" onChange={this.handleChange.bind(this)}>
             {this.state.stations}
           </FormControl></Col>

         <Col lg={6}><ControlLabel>Amount</ControlLabel>
         <FormControl name="amount" type="number" onChange={this.handleChange.bind(this)}/></Col>
       </Row>

       <Row>
         {this.props.type === "Broadcast" ? <Col lg={6}><ControlLabel>CPP</ControlLabel>
         <FormControl name="cpp" type="number" onChange={this.handleChange.bind(this)}/></Col> : null}

         {this.props.type === "Broadcast" ? <Col lg={6}><ControlLabel>TRPS</ControlLabel>
         <FormControl disabled name="trps" type="number" value={this.state.trps} /></Col> : null}

         {this.props.type === "Cable" ? <Col lg={12}><ControlLabel>Spots</ControlLabel>
         <FormControl name="spots" type="number" onChange={this.handleChange.bind(this)}/></Col> : null}
       </Row>

         <Button bsStyle="primary" type="submit">Create</Button>
         <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
             {this.state.days}
       </FormGroup>
       </form>
     </Modal.Body>
     {this.state.openNewStation && <NewStation market={this.props.market} type={this.props.type} showCreate={this.state.openNewStation} onResultChange={this.closeNewStation.bind(this)}/>}
    </Modal>
    );
  }
}

export default NewBuyDetail;
