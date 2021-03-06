import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class DeleteBuyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: this.props.showDelete
    }
  }

  modalClose() {
     this.setState({ showModal: false });
     this.props.onResultChange();
   }

   async deleteBuyType(){
     await fetch('/api/mediabuydetails' + this.props.id, {
           method: 'DELETE',
           headers: {
             'Content-Type': 'application/json'
             }
           })
     this.props.onResultChange();
   }

  render() {
    return (
      <Modal show={this.props.showDelete} onHide={this.modalClose.bind(this)}>
      <Modal.Body>
        <h2>Are you sure you want to delete Media Buy Detail:{this.props.id}</h2>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
        <Button onClick={this.deleteBuyType.bind(this)} bsStyle="danger">Confirm</Button>
      </Modal.Footer>
    </Modal>
    );
  }
}

export default DeleteBuyDetail;
