import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button, ListGroupItem } from 'react-bootstrap';

class Adduser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districts: [],
      selected: 0
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/groupdis');

    await response.json().then(data => {

      var districts = [];
      data.data.map(item => {
          districts.push(<ListGroupItem onClick={this.selectDistrict.bind(this, item)}>{item.districtcode}</ListGroupItem>)
      })

      this.setState({districts: districts});
    })
  }

  selectDistrict(item){
    this.setState({selected: item.districtid})
  }

  modalClose() {
   this.setState({ showModal: false });
   this.props.onResultChange();
 }

 async addDistrict(e){
   e.preventDefault();

   var body = {
     groupid: this.props.groupid,
     districtid: this.state.selected
   }

  await fetch('/api/groupdis', {
   method: 'POST',
   body: JSON.stringify(body),
   headers: {
     'Content-Type': 'application/json'
     }
   })
   this.props.onResultChange();
 }

  render() {
    const { districts } = this.state;
    return (
      <Modal show={this.props.showCreate} onHide={this.modalClose.bind(this)}>
        <Modal.Header closeButton>
         <Modal.Title>{this.props.group} Add District</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <div className="permissionList">
         {districts}
       </div>
         <Button bsStyle="primary" type="submit" onClick={this.addDistrict.bind(this)}>Add</Button>
         <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
     </Modal.Body>
    </Modal>
    );
  }
}

export default Adduser;
