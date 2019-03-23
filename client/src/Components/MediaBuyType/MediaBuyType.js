import React, { Component } from "react";
import { Button, Table } from 'react-bootstrap';
import ExpandSection from "./ExpandSection"
import EditBuyType from "./EditBuyType"
import DeleteBuyType from "./DeleteBuyType"
import NewBuyType from './NewBuyType'

class MediaBuyType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results:{ mediabuytype:[] },
      toggle: false,
      openEdit: false,
      deletePrompt: false,
      openCreate: false,
      currentItem: 0,
      currentMarketId: 0,
      currentMarket: ''
    }
  }

async componentDidMount() {
    const response = await fetch('/api/mediabuytype/mediabuy' + this.props.id);
    const data = await response.json();

    /*Map the ID of each mediabuytype to set state initally false that will be
    used for toggling expandsection
    Also map the market for every item to give the components the correct market they are assoicated to,
    the id is unique to each but the market is not since it is ok to reuse it because same markets can be used
    with multiple buytypes
    It must be done this way do to the nature of expand sections work with React
    */
    await data.mediabuytype.map(item => {
      return this.setState({[item.mediabuytypeid]: false, [item.market]: ''})
    })
    this.setState({ results: data });
  }

  /*Where we initally set the state for the buytypeid and market so that the expandsection
  components get their correct id to toggle only 1 expand section and give them the correct market that
  will be used in their drop down section in the Create/Edit screen */
  toggleExpand(id, market){
    this.setState({[id]: !this.state[id], [market]: market})
  }

  openEdit(id, marketid) {
    this.setState({ currentItem: id, currentMarketId: marketid, openEdit: true});
  }

  onEditClose() {
    this.setState({openEdit: false});
    this.componentDidMount();
  }

  openDeletePrompt(id) {
    this.setState({ currentItem: id, deletePrompt: true});
  }

  onDeleteClose() {
    this.setState({deletePrompt: false});
    this.componentDidMount();
  }

  openCreateWindow(){
    this.setState({openCreate: true});
  }

  onCreateClose() {
    this.setState({openCreate: false});
    this.componentDidMount();
  }

  render() {
    const { results } = this.state;
    const { startdate, enddate } = this.props;
    return (
      <div>
        <Button bsStyle="success" onClick={this.openCreateWindow.bind(this)}>New Buy Type</Button>
        {this.state.openCreate && <NewBuyType id={this.props.id} showCreate={this.state.openCreate} onResultChange={this.onCreateClose.bind(this)}/>}
      <Table striped bordered condensed>
        <thead className="thDark">
            <tr>
              <th className="buttonCell"></th>
              <th>Schedule Type</th>
              <th>Media Type</th>
              <th>Market (mediamarket)</th>
              <th>Total</th>
            </tr>
        </thead>
          {results.mediabuytype.map(item => {
            return(
                <tbody key={item.mediabuytypeid}>
                <tr>
                  <td className="buttonCell">
                    <Button bsStyle="primary" onClick={this.toggleExpand.bind(this, item.mediabuytypeid, item.market)}>Expand</Button>
                    <Button bsStyle="warning" onClick={this.openEdit.bind(this, item.mediabuytypeid, item.marketid)}>Edit</Button>
                    <Button bsStyle="danger" onClick={this.openDeletePrompt.bind(this, item.mediabuytypeid)}>Delete</Button>
                  </td>
                  <td>{item.scheduletype}</td>
                  <td>{item.mediatype}</td>
                  <td>{item.market}</td>
                  <td>{item.total}</td>
                </tr>
                {this.state[item.mediabuytypeid] ? <tr>
                  <td colSpan="8"><ExpandSection
                                      startdate={startdate}
                                      enddate={enddate}
                                      toggle={this.state[item.mediabuytypeid]}
                                      id={item.mediabuytypeid}
                                      market={this.state[item.market]}
                                      type={item.mediatype}
                                      buyid={this.props.id}/>
                   </td>
                </tr>: null}
              </tbody>
            )
          })}
      </Table>
      {this.state.openEdit && <EditBuyType id={this.state.currentItem} marketID={this.state.currentMarketId} showEdit={this.state.openEdit} onResultChange={this.onEditClose.bind(this)}/>}
      {this.state.deletePrompt && <DeleteBuyType id={this.state.currentItem} showDelete={this.state.deletePrompt} onResultChange={this.onDeleteClose.bind(this)}/>}
    </div>
    );
  }
}

export default MediaBuyType;
