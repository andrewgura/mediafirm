import React, { Component } from "react";
import { Modal, FormControl, ControlLabel, Row, Col } from 'react-bootstrap';
import MediaBuyType from '../MediaBuyType/MediaBuyType';

class MediaBuyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: this.props.showCreate,
      startdate: '',
      enddate: ''
    }
  }

async componentDidMount() {
  const response = await fetch('/api/mediabuy' + this.props.id);
  await response.json().then(data => {
  let mbuy = data.mediabuys.map(item => {
    this.setState({startdate: item.startdate, enddate: item.enddate});
      return(
          <div key={item.mediabuyid}>
            <Row>
              <Col md={4}>
                <ControlLabel>Spender (s)</ControlLabel>
                <FormControl disabled value={item.spender}/>
              </Col>
              <Col md={4}>
                <ControlLabel>Start Date</ControlLabel>
                <FormControl disabled value={item.startdate}/>
              </Col>
              <Col md={4}>
                <ControlLabel>End Date</ControlLabel>
                <FormControl disabled value={item.enddate}/>
              </Col>
            </Row>
          </div>
      )
    })
    this.setState({mbuy: mbuy});
  })
}

modalClose(){
  this.setState({ showModal: false });
  this.props.onResultChange();
}

  render() {
    return (
      <Modal bsSize="lg" className="infoModal" show={this.props.showInfo} onHide={this.modalClose.bind(this)}>
        <Modal.Body>
              {this.state.mbuy}
          <h3>Media Buy Type</h3>
          <hr/>
          <MediaBuyType id={this.props.id} startdate={this.state.startdate} enddate={this.state.enddate}/>
        </Modal.Body>
    </Modal>
    );
  }
}

export default MediaBuyInfo;
