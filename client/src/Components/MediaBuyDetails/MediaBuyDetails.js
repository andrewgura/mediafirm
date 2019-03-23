import React, { Component } from "react";
import { Button, Table, Row, Col } from 'react-bootstrap';
import NewBuyDetail from "./NewBuyDetail";
import DeleteBuyDetail from './DeleteBuyDetail';
import EditMediaBuyDetail from "./EditMediaBuyDetail";

class MediaBuyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results:{ mediabuydetails:[] },
      openNewBuyDetail: false,
      deletePrompt: false,
      openEdit: false
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/mediabuydetails/mediabuytype' + this.props.id);
    const data = await response.json();
    this.setState({ results: data });
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

  openEdit(id) {
    this.setState({ currentItem: id, openEdit: true});
  }

  onEditClose() {
    this.setState({openEdit: false});
    this.componentDidMount();
  }

  render() {
    var { results } = this.state;
    const { startdate, enddate } = this.props;
    return (
      <div>
        <Row><Col mdOffset={2}><Button bsSize="small" bsStyle="success" onClick={this.openCreateWindow.bind(this)}>New Buy Detail</Button></Col></Row>
        <Row><Col mdOffset={2}><Table bordered condensed className="buyDetailTable">
          <thead className="thLight">
            <tr>
              <th className="buttonCell"></th>
              <th className="text-center">Station</th>
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
                   <Button bsSize="small" bsStyle="warning" onClick={this.openEdit.bind(this, item.mediabuydetailid)}>Edit</Button>
                    <Button bsSize="small" bsStyle="danger" onClick={this.openDeletePrompt.bind(this, item.mediabuydetailid)}>Delete</Button>
                  </td>
                  <td>{item.station}</td>
                  <td>{item.amount}</td>
                  <td>{item.cpp}</td>
                  <td>{item.trps}</td>
                  <td>{item.spots}</td>
                </tr>
              )
            })}
          </tbody>
        </Table></Col></Row>
        {this.state.openNewBuyDetail && <NewBuyDetail type={this.props.type} startdate={startdate} enddate={enddate} buyid={this.props.buyid} id={this.props.id} showCreate={this.state.openNewBuyDetail} market={this.props.market} onResultChange={this.onCreateClose.bind(this)}/>}
        {this.state.deletePrompt && <DeleteBuyDetail id={this.state.currentItem} showDelete={this.state.deletePrompt} onResultChange={this.onDeleteClose.bind(this)}/>}
        {this.state.openEdit && <EditMediaBuyDetail  type={this.props.type} startdate={startdate} enddate={enddate} buyid={this.props.buyid} id={this.state.currentItem} market={this.props.market} showEdit={this.state.openEdit} onResultChange={this.onEditClose.bind(this)}/>}
      </div>
    );
  }
}

export default MediaBuyDetails;
