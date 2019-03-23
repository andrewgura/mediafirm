import React, { Component } from 'react';
import download from 'downloadjs';
import { Row, Col, Button, Radio } from 'react-bootstrap';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css'
var moment = require('moment');

class SpenderSummary extends Component {
/* eslint-disable */
  constructor(props) {
    super(props);
    this.state = {
      start: "",
      end: "",
      earliestStart: "",
      earliestEnd: "",
      times: [],
      rangeSlider: [],
      type: 'regular',
      minSlide: 1,
      maxSlide: 0,
      maxSlideStart: 0
    }
  }

  async componentDidMount() {

    const response = await fetch('/api/summarySpender' + this.props.districtid + "/electiontype" + this.props.type);
    await response.json().then(data => {

      var earliestStart, earliestEnd;

      if(data.earliestStartEndBuys === undefined) {
        earliestStart = ''
        earliestEnd = ''
      } else {
        earliestStart = data.earliestStartEndBuys.startdate;
        earliestEnd = data.earliestStartEndBuys.enddate;
      }

      this.setState({
        start: data.startEndDates.generalWeekStart, end: data.startEndDates.generalWeekEnd,
        earliestStart: earliestStart, earliestEnd: earliestEnd
      });
    })

    await this.weekrange();
  }


  async weekrange() {
        var times = [];

        var start = new Date(this.state.start)
        var finish = new Date(this.state.end)

        var startweek = moment(start).add(1, "days").format("MM/DD");
        var finishweek = moment(finish).add(1, "days").format("MM/DD");

        var lastweek = startweek + " - " + finishweek;

        var inc = 0;

         do {
           var x = moment(start).subtract(inc, "weeks").add(1, "days").format("MM/DD");
           var y = moment(finish).subtract(inc, "weeks").subtract(1, "days").format("MM/DD");

           var weekspan= x + " - " + y
           times.push(weekspan)
           inc++;
         } while (x > moment(this.state.earliestStart).format("MM/DD") === true);
         times.reverse();
         times.pop();
         times.push(lastweek)

         this.setState({times: times, maxSlide: times.length, maxSlideStart: times.length})

         await this.buildWeekDisplayRange()
  }

  buildWeekDisplayRange() {
    var x = [
      <div key="x" style={{width: "70%", margin: "20px", marginLeft: "50px"}}>
           <Range min={1} max={this.state.maxSlideStart} defaultValue={[1, this.state.maxSlide]} onChange={this.weekRangeSlide.bind(this)}/>
      </div>
    ]

    this.setState({rangeSlider: x});
  }

  weekRangeSlide(event) {
    this.setState({minSlide: event[0], maxSlide: event[1]})

    var cells = document.getElementsByClassName("week");

    for(var i = 0; i < cells.length; i++) {
      var currentCell = Number(cells[i].className.replace(/\D/g,''));

        if(event[0] <= currentCell && currentCell <= event[1] ){
            cells[i].classList.remove("hide")
        } else {
          cells[i].classList.add("hide")
        }

    }
  }


  createSpenderSummary(event) {
    event.preventDefault();

    var body = {
      adids: this.props.adids,
      districtid: this.props.districtid,
      electiontype: this.props.type,
      type: this.state.type,
      start: this.state.minSlide,
      end: this.state.maxSlide
    };

  fetch('/api/spendersummary', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    return response.blob();
  }).then(function(blob) {
    return download(blob, "sample.xlsx");
  });
}

handleChange(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({[name]: value});
}


  render() {
    return (
      <div style={{height: "300px"}}>
          <div className="spendersummary-box">
            <form style={{padding: "0 10px"}} onSubmit={this.createSpenderSummary.bind(this)}>
            <h4 style={{fontWeight: "bold"}}>Download Spender Summary</h4>
            <hr style={{margin: "7px 0"}}/>
            <Row><Col xs={12}><Radio name="type" value="regular" onChange={this.handleChange.bind(this)} inline defaultChecked>Spender Summary</Radio></Col></Row>
            <Row><Col xs={12}><Radio name="type" value="bymarket" onChange={this.handleChange.bind(this)} inline>Spennder Summary by Market</Radio></Col></Row>
            <Row><Col xs={12}><Radio name="type" value="bystation" onChange={this.handleChange.bind(this)} inline>Spender Summary by Station</Radio></Col></Row>
            <Row><Col xs={12}><Radio name="type" value="fvuf" onChange={this.handleChange.bind(this)} inline>Friendly vs Unfriendly</Radio></Col></Row>
            <Row><Col xs={12}><Radio name="type" value="cppreport" onChange={this.handleChange.bind(this)} inline>CPP Report</Radio></Col></Row>
            <h3 className="text-center">Weeks {this.state.minSlide} - {this.state.maxSlide}</h3>
            {this.state.rangeSlider}
            <Button style={{margin: "15px auto", display: "block"}} type="submit">Download</Button>
            </form>
          </div>
    </div>
    );
  }
}

export default SpenderSummary;
