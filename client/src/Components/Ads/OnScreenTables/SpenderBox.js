import React, { Component } from "react";
import ViewSpenderSum from "./ViewSpenderSum";
import ViewMarketSummary from "./ViewMarketSummary";
import ViewCpp from "./ViewCpp";
import ViewFriendvsUn from "./ViewFriendvsUn";
import ViewStationSummary from "./ViewStationSummary";
import { Row, Col, Button } from 'react-bootstrap';

class SpenderBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spenderSummary: false,
      marketSummary: false,
      cppReport: false,
      fvuf: false,
      stationSummary: false,
      type: this.props.type
    }
  }

  showSpenderSummary(){
    this.setState({spenderSummary: true})
  }

  closeSpenderSummary() {
    this.setState({spenderSummary: false})
  }

  showMarketSummary(){
    this.setState({marketSummary: true})
  }

  closeMarketSummary() {
    this.setState({marketSummary: false})
  }

  showCpp(){
    this.setState({cppReport: true})
  }

  closeCpp() {
    this.setState({cppReport: false})
  }

  showFvuf(){
    this.setState({fvuf: true})
  }

  closeFvuf() {
    this.setState({fvuf: false})
  }

  showStation(){
    this.setState({stationSummary: true})
  }

  closeStation() {
    this.setState({stationSummary: false})
  }


  render() {
    return (
      <div>
        <div style={{height: "300px"}}>
            <div className="show-spendersummary-box">
              <h4 className="text-center" style={{fontWeight: "bold"}}>On Screen Tables</h4>
              <hr style={{margin: "7px 0"}}/>
              <Row><Col xs={12}><Button bsStyle="info" className="showSpenderSummaryButton" onClick={this.showSpenderSummary.bind(this)}>Show Spender Summary</Button></Col></Row>
              <Row><Col xs={12}><Button bsStyle="info" onClick={this.showMarketSummary.bind(this)}>Show Spender Summary by Market</Button></Col></Row>
              <Row><Col xs={12}><Button bsStyle="info" onClick={this.showStation.bind(this)}>Show Spender Summary by Station</Button></Col></Row>
              <Row><Col xs={12}><Button bsStyle="info" onClick={this.showFvuf.bind(this)}>Show Friendly vs Unfriendly</Button></Col></Row>
              <Row><Col xs={12}><Button bsStyle="info" onClick={this.showCpp.bind(this)}>Show CPP Report</Button></Col></Row>
            </div>
      </div>
        {this.state.spenderSummary && <ViewSpenderSum showSpenderSummary={this.state.spenderSummary} type={this.props.type} onResultChange={this.closeSpenderSummary.bind(this)} districtid={this.props.districtid} />}
        {this.state.marketSummary && <ViewMarketSummary showSpenderSummary={this.state.marketSummary} type={this.props.type} onResultChange={this.closeMarketSummary.bind(this)} districtid={this.props.districtid} />}
        {this.state.cppReport && <ViewCpp showSpenderSummary={this.state.showCpp} type={this.props.type} onResultChange={this.closeCpp.bind(this)} districtid={this.props.districtid} />}
        {this.state.fvuf && <ViewFriendvsUn showSpenderSummary={this.state.showFvuf} type={this.props.type} onResultChange={this.closeFvuf.bind(this)} districtid={this.props.districtid} />}
        {this.state.stationSummary && <ViewStationSummary showSpenderSummary={this.state.showStation} type={this.props.type} onResultChange={this.closeStation.bind(this)} districtid={this.props.districtid} />}
      </div>
    );
  }
}

export default SpenderBox;
