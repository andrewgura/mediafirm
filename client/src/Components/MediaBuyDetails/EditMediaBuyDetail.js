import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl,Col, Row, Button } from 'react-bootstrap';
var dateFormat = require('dateformat');

/* eslint-disable */

class EditMediaBuyDetail extends Component {
 constructor(props) {
   super(props);
   this.state = {
      showModal: this.props.showEdit,
      station: 0,
      amount: 0,
      cpp: 0,
      trps: 0,
      spots: 0,
      stations: [],
      days: [],
      dates: []
   }
 }

 async componentDidMount() {
   var dates = [];
   const response = await fetch('/api/details' + this.props.id);
   const data = await response.json();  // eslint-disable-next-line
   let detailbreakdown = data.detailbreakdown.map(item => {
     var a = {[item.date]: item.percent.toString()}
     dates.push(a);
   })

   var combineDates = await dates.reduce((acc, obj) => {
     var old = null;
     let key = Object.keys(obj)[0]
     old = acc.find(item => key === Object.keys(item)[0]);
     if (!old) {
       acc.push(obj);
     } else {
       old[key] += `,${obj[key]}`;
     }

     return acc;
   }, []);
   this.setState({dates: combineDates})
  this.formatStartEnd()

   //Fill in the input field with the current values
   this.setState({
     station: data.mediabuydetails[0].stationsystemid,
     amount: data.mediabuydetails[0].amount,
     cpp: data.mediabuydetails[0].cpp,
     trps: data.mediabuydetails[0].trps,
     spots: data.mediabuydetails[0].spots
   })

   const getStations = await fetch('/api/stations' + this.props.market + '/current' + this.state.station);
   await getStations.json().then(data => {
   let stations = data.stations.map(item => {
       return(
         <option key={item.stationid} value={item.stationid}>{item.station}</option>
       )
     })
     this.setState({stations: stations});
   })
 }

modalClose() {
  this.setState({ showModal: false });
  this.props.onResultChange();
}

async handleInputChange(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  await this.setState({[name]: value});
  this.props.type == "Broadcast" ? this.calcTrps() : null;
}

calcTrps() {
  var trp = this.state.amount / this.state.cpp;
  this.setState({trps: trp})
}

 formatStartEnd(){
   var { startdate, enddate } = this.props;

   //Format the start and end date into JavaScript Dates
   var partstart = startdate.split('-');  // eslint-disable-next-line
   var startdate = new Date(partstart[0], partstart[1] - 1, partstart[2]);

   var partsend = enddate.split('-');  // eslint-disable-next-line
   var enddate = new Date(partsend[0], partsend[1] - 1, partsend[2]);

   //Takes the difference of the days
   var timeDiff = Math.abs(startdate.getTime() - enddate.getTime());
   var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; //plus 1 to go through the enddate
   //days to be displayed on render
   var days = [];

   for(var i = 0; i < diffDays; i++) {  // eslint-disable-next-line
       var startdate = new Date(partstart[0], partstart[1] - 1, partstart[2]);
       startdate.setDate(startdate.getDate() + i);  // eslint-disable-next-line
       var startdate  = dateFormat(startdate,"yyyy-mm-dd");

       //Getting each date and pushing into dates array with a default of 100%

       //Pushing HTML into days array to display on render


       days.push(
         <div key={i}>
          <h3>{startdate}</h3>
          <hr/>
          <input type="text" name={startdate} defaultValue={this.state.dates[i][startdate]} onChange={this.handlePercentChange.bind(this,i)}/>
       </div>)
   }
   //Days to be rendered onto screen, dates where each day is being store with their percents
    this.setState({days: days});
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


submitEdit(e) {
  e.preventDefault();
  var body = {
    station: this.state.station,
    amount: this.state.amount,
    cpp: this.state.cpp,
    trps: this.state.trps,
    spots: this.state.spots,
    buyid: this.props.buyid,
    dates: this.state.dates
  }

  fetch('/api/details' + this.props.id, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  this.props.onResultChange();
}

 render() {
   return (
     <Modal show={this.props.showEdit} onHide={this.modalClose.bind(this)}>
      <Modal.Body>
        <form onSubmit={this.submitEdit.bind(this)}>
        <FormGroup>
        <Row>
          <Col lg={6}>  <ControlLabel>Amount</ControlLabel>
          <FormControl name="amount" type="number" value={this.state.amount} onChange={this.handleInputChange.bind(this)}/></Col>

          {this.props.type == "Cable" ? <Col lg={6}><ControlLabel>Spots</ControlLabel>
            <FormControl name="spots" type="number" value={this.state.spots} onChange={this.handleInputChange.bind(this)}/></Col> : null}
        </Row>

        <Row>
          {this.props.type == "Broadcast" ? <Col lg={6}>  <ControlLabel>CPP</ControlLabel>
          <FormControl name="cpp" type="number" value={this.state.cpp} onChange={this.handleInputChange.bind(this)}/></Col> : null}

          {this.props.type == "Broadcast" ? <Col lg={6}>  <ControlLabel>TRPS</ControlLabel>
          <FormControl name="trps" disabled type="number" value={this.state.trps} onChange={this.handleInputChange.bind(this)}/></Col> : null}
        </Row>

        <Row>
          <Col lg={12}>  <ControlLabel>Station</ControlLabel>
          <FormControl name="station" componentClass="select" onChange={this.handleInputChange.bind(this)}>
              {this.state.stations}
            </FormControl></Col>
        </Row>

          <Button bsStyle="primary" type="submit">Update</Button>
          <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
        </FormGroup>
      </form>
      {this.state.days}
    </Modal.Body>
   </Modal>
   );
 }
}

export default EditMediaBuyDetail;
