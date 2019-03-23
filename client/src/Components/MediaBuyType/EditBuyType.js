import React, { Component } from "react";
import { Modal, FormGroup, Row, Col, FormControl, ControlLabel, Button } from 'react-bootstrap';

class EditBuyType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediamarkets: [],
      scheduletype: "",
      mediatype: "",
      total: "",
      marketid: ""
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/mediabuytype' + this.props.id);
    const data = await response.json();
    this.setState({
      scheduletype: data.mediabuytype[0].scheduletype,
      mediatype: data.mediabuytype[0].mediatype,
      total: data.mediabuytype[0].total,
      marketid: data.mediabuytype[0].marketid
    })

    const getMarkets = await fetch('/api/mediamarkets' + this.props.marketID);
    await getMarkets.json().then(data => {
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  async submitEdit(e) {
    e.preventDefault();
    var body = {
      scheduletype: this.state.scheduletype,
      mediatype: this.state.mediatype,
      total: this.state.total,
      marketid: this.state.marketid
    }

    await fetch('/api/mediabuytype' + this.props.id, {
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
        <Modal.Header closeButton>
         <Modal.Title>Edit Media Buy Type</Modal.Title>
       </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.submitEdit.bind(this)}>
          <FormGroup>

          <Row>
          <Col lg={6}><ControlLabel>Schedule Type</ControlLabel>
            <FormControl name="scheduletype" type="number" value={this.state.scheduletype} onChange={this.handleInputChange.bind(this)}/></Col>

            <Col lg={6}>  <ControlLabel>Media Type</ControlLabel>
            <FormControl name="mediatype" type="text" value={this.state.mediatype} onChange={this.handleInputChange.bind(this)}/></Col>
          </Row>

          <Row>
            <Col lg={6}>  <ControlLabel>Total</ControlLabel>
            <FormControl name="total" type="number" value={this.state.total} onChange={this.handleInputChange.bind(this)}/></Col>

            <Col lg={6}><ControlLabel>Market</ControlLabel>
            <FormControl name="marketid" componentClass="select" onChange={this.handleInputChange.bind(this)}>
                {this.state.mediamarkets}
              </FormControl></Col>
          </Row>

            <Button bsStyle="primary" type="submit">Update</Button>
            <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
          </FormGroup>
          </form>
      </Modal.Body>
    </Modal>
    );
  }
}

export default EditBuyType;
