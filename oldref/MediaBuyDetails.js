import React, { Component } from "react";
import { Button, Table, FormControl, Row, Col } from 'react-bootstrap';
import NewBuyDetail from "./NewBuyDetail";
import DeleteBuyDetail from './DeleteBuyDetail';

class MediaBuyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results:{ mediabuydetails:[] },
      openNewBuyDetail: false,
      deletePrompt: false
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/mediabuydetails' + this.props.id);
    const data = await response.json();
    await data.mediabuydetails.map(item => {
      return this.setState({
        [item.mediabuydetailid]: false,
        [item.mediabuydetailid + "type"]  : item.type,
        [item.mediabuydetailid + "amount"]  : item.amount,
        [item.mediabuydetailid + "cpp"]  : item.cpp,
        [item.mediabuydetailid + "trps"]  : item.trps,
        [item.mediabuydetailid + "spots"]  : item.spots
      })
    })
    this.setState({ results: data });
  }

  allowEdit(id){
    this.setState({[id]: !this.state[id]})
  }

  handleInputChange(id, event){
     const target = event.target;
     const value = target.value;
     const name = id + target.name;
     this.setState({[name]: value});
  }

  updateItem(id) {
    var body = {
      type: this.state[id + "type"],
      amount: this.state[id + "amount"],
      cpp: this.state[id + "cpp"],
      trps: this.state[id + "trps"],
      spots: this.state[id + "spots"]
    }

    fetch('/api/mediabuydetails' + id, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.setState({[id]: !this.state[id]});
  }

  openCreateWindow(){
    this.setState({openNewBuyDetail: true});
  }

  onCreateClose() {
    this.setState({openNewBuyDetail: false});
    this.componentDidMount();
  }

  openDeletePrompt(id) {
    this.setState({ currentItem: id, deletePrompt: true});
  }

  onDeleteClose() {
    this.setState({deletePrompt: false});
    this.componentDidMount();
  }

  render() {
    var { results } = this.state;
    return (
      <div>
        <Row><Col mdOffset={2}><Button bsSize="small" bsStyle="success" onClick={this.openCreateWindow.bind(this)}>New Buy Detail</Button></Col></Row>
        <Row><Col mdOffset={2}><Table bordered condensed className="buyDetailTable">
          <thead className="thLight">
            <tr>
              <th className="buttonCell"></th>
              <th className="text-center">Station Type(station)</th>
              <th className="text-center">Amount</th>
              <th className="text-center">CPP</th>
              <th className="text-center">TRPS</th>
              <th className="text-center">Spots</th>
          </tr>
          </thead>
          <tbody>
            {results.mediabuydetails.map(item => {
              return(
                <tr key={item.mediabuydetailid}>
                  <td className="buttonCell">
                    {!this.state[item.mediabuydetailid] ? <Button bsSize="small" bsStyle="warning" onClick={this.allowEdit.bind(this, item.mediabuydetailid)}>Edit</Button> : <Button  bsStyle="info" bsSize="small" onClick={this.updateItem.bind(this, item.mediabuydetailid)}>Save</Button>}
                    {!this.state[item.mediabuydetailid] ? <Button bsSize="small" bsStyle="danger" onClick={this.openDeletePrompt.bind(this, item.mediabuydetailid)}>Delete</Button> : <Button bsSize="small" onClick={this.allowEdit.bind(this, item.mediabuydetailid)}>Cancel</Button>}
                  </td>
                  <td>{!this.state[item.mediabuydetailid] ? this.state[item.mediabuydetailid + "type"]: <FormControl type="number" value={this.state[item.mediabuydetailid + "type"]} onChange={this.handleInputChange.bind(this, item.mediabuydetailid)} name="type"/>}</td>
                  <td>{!this.state[item.mediabuydetailid] ? this.state[item.mediabuydetailid + "amount"] : <FormControl type="number" value={this.state[item.mediabuydetailid + "amount"]} onChange={this.handleInputChange.bind(this, item.mediabuydetailid)} name="amount"/>}</td>
                  <td>{!this.state[item.mediabuydetailid] ? this.state[item.mediabuydetailid + "cpp"]: <FormControl type="number" value={this.state[item.mediabuydetailid + "cpp"]} onChange={this.handleInputChange.bind(this, item.mediabuydetailid)} name="cpp"/>}</td>
                  <td>{!this.state[item.mediabuydetailid] ? this.state[item.mediabuydetailid + "trps"] : <FormControl type="number" value={this.state[item.mediabuydetailid + "trps"]} onChange={this.handleInputChange.bind(this, item.mediabuydetailid)} name="trps"/>}</td>
                  <td>{!this.state[item.mediabuydetailid] ? this.state[item.mediabuydetailid + "spots"] : <FormControl type="number" value={this.state[item.mediabuydetailid + "spots"]} onChange={this.handleInputChange.bind(this, item.mediabuydetailid)} name="spots"/>}</td>
                </tr>
              )
            })}
          </tbody>
        </Table></Col></Row>
        {this.state.openNewBuyDetail && <NewBuyDetail buyid={this.props.buyid} id={this.props.id} showCreate={this.state.openNewBuyDetail} onResultChange={this.onCreateClose.bind(this)}/>}
        {this.state.deletePrompt && <DeleteBuyDetail id={this.state.currentItem} showDelete={this.state.deletePrompt} onResultChange={this.onDeleteClose.bind(this)}/>}
      </div>
    );
  }
}

export default MediaBuyDetails;
