import React, { Component } from 'react';
import {Table, Button} from 'react-bootstrap';
import MediaBuyInfo from '../Components/MediaBuys/MediaBuyInfo.js';
import NewMediaMarket from '../Components/MediaBuys/NewMediaBuy.js';
import MediaBuyDelete from '../Components/MediaBuys/MediaBuyDelete.js';
import EditMediaBuy from '../Components/MediaBuys/EditMediaBuy.js';
import NewSpender from '../Components/Spenders/NewSpender';
import NewAd from '../Components/Ads/NewAd';

class MediaBuys extends Component {
/* eslint-disable */
  constructor(props) {
    super(props);
    this.state = {
      markets: [],
      districtid: 0,
      marketid: 0,
      openInfo: false,
      openCreate: false,
      openEdit: false,
      deletePrompt: false,
      currentItem: 0,
      currentad: 0,
      currentSpender: '',
      openNewSpender: false,
      openNewAd: false
    }
  }

  async componentDidMount() {

    //Determine weather to show buys based off of districtid or marketid
    if(this.props.location.pathname.search("markets") == true) {
      await this.setState({marketid: + this.props.match.params.id})
      var response = await fetch('/api/mediabuysmarket' + this.state.marketid);
    } else {
      await this.setState({districtid: + this.props.match.params.id})
      var response = await fetch('/api/mediabuysdistrict' + this.state.districtid);
    }


    var markets = [];
    var general = [];
    var primary = [];




    await response.json().then(data => {
      data.mediabuys.map(item => {

      if(item.electiontype == 'Primary') {
            primary.push(
                <tr key={item.mediabuyid}>
                  <td className="buttonCell">
                    <Button bsSize="small" bsStyle="danger" onClick={this.openDelete.bind(this,item.mediabuyid)}>Delete</Button>
                    <Button bsSize="small" bsStyle="warning" onClick={this.openEdit.bind(this,item.mediabuyid, item.spenderid, item.adid)}>Edit</Button>
                  </td>
                  <td onClick={this.openInfo.bind(this,item.mediabuyid)}>{item.mediabuyid}</td>
                  <td>{item.startdate}</td>
                  <td>{item.enddate}</td>
                  <td>{item.description}</td>
                  <td>{item.spender}</td>
                  <td>{item.electiontype}</td>
                </tr>
          )
      } else {
            general.push(
                <tr key={item.mediabuyid}>
                  <td className="buttonCell">
                    <Button bsSize="small" bsStyle="danger" onClick={this.openDelete.bind(this,item.mediabuyid)}>Delete</Button>
                    <Button bsSize="small" bsStyle="warning" onClick={this.openEdit.bind(this,item.mediabuyid, item.spenderid, item.adid)}>Edit</Button>
                  </td>
                  <td onClick={this.openInfo.bind(this,item.mediabuyid)}>{item.mediabuyid}</td>
                  <td>{item.startdate}</td>
                  <td>{item.enddate}</td>
                  <td>{item.description}</td>
                  <td>{item.spender}</td>
                  <td>{item.electiontype}</td>
                </tr>
            )
          }
      })


      var primTable = [
        <div>
          <h3>Primary Buys</h3>
            <Table striped bordered condensed hover>
              <thead className="thDark">
                <tr>
                  <th className="buttonCell"></th>
                  <th className="text-center">mediabuyid</th>
                  <th className="text-center">Start Date</th>
                  <th className="text-center">End Date</th>
                  <th className="text-center">Ad</th>
                  <th className="text-center">Spender</th>
                  <th className="text-center">Election Type</th>
                </tr>
              </thead>
              <tbody>
                {primary}
              </tbody>
            </Table>
        </div>
        ]

          var genTable = [
            <div><h3>General Buys</h3>
              <Table striped bordered condensed hover>
                <thead className="thDark">
                  <tr>
                    <th className="buttonCell"></th>
                    <th className="text-center">mediabuyid</th>
                    <th className="text-center">Start Date</th>
                    <th className="text-center">End Date</th>
                    <th className="text-center">Ad</th>
                    <th className="text-center">Spender</th>
                    <th className="text-center">Election Type</th>
                  </tr>
                </thead>
                <tbody>
                  {general}
                </tbody>
              </Table></div>]

      markets.push(primTable)
      markets.push(genTable)
      this.setState({markets: markets});
    })
  }

  openInfo(id) {
    this.setState({openInfo: true, currentItem: id});
  }

  onInfoClose() {
    this.setState({openInfo: false});
  }

  openCreateWindow(){
    this.setState({openCreate: true});
  }

  onCreateClose() {
    this.setState({openCreate: false});
    this.componentDidMount();
  }

  openDelete(id){
    this.setState({deletePrompt: true, currentItem: id});
  }

  onDeleteClose() {
    this.setState({deletePrompt: false});
    this.componentDidMount();
  }

  openEdit(id, spenderid, currentad){
    this.setState({openEdit: true, currentItem: id, currentSpender: spenderid, currentad: currentad});
  }

  onEditClose() {
    this.setState({openEdit: false});
    this.componentDidMount();
  }

  openNewSpender(e){
    e.preventDefault();
    this.setState({openNewSpender: true})
  }

  closeNewSpender() {
    this.setState({openNewSpender: false});
    this.componentDidMount();
  }

  openNewAd(e){
    e.preventDefault();
    this.setState({openNewAd: true})
  }

  closeNewAd() {
    this.setState({openNewAd: false});
    this.componentDidMount();
  }

  render() {
    return (
      <div>
        <Button bsStyle="success" onClick={this.openCreateWindow.bind(this)}>New Media Buy</Button>
        <Button bsStyle="success" onClick={this.openNewSpender.bind(this)}>New Spender</Button>
        <Button bsStyle="success" onClick={this.openNewAd.bind(this)}>New Spot</Button>
            {this.state.markets}
        {this.state.openCreate && <NewMediaMarket districtid={this.state.districtid} marketid={this.state.marketid} showCreate={this.state.openCreate} onResultChange={this.onCreateClose.bind(this)}/>}
        {this.state.openInfo && <MediaBuyInfo id={this.state.currentItem} onResultChange={this.onInfoClose.bind(this)} showInfo={this.state.openInfo}/>}
        {this.state.deletePrompt && <MediaBuyDelete id={this.state.currentItem} showDelete={this.state.deletePrompt} onResultChange={this.onDeleteClose.bind(this)}/>}
        {this.state.openEdit && <EditMediaBuy id={this.state.currentItem} spenderid={this.state.currentSpender} currentad={this.state.currentad} districtid={this.props.match.params.id} showEdit={this.state.openEdit} onResultChange={this.onEditClose.bind(this)}/>}
        {this.state.openNewSpender && <NewSpender districtid={this.state.districtid} showCreate={this.state.openNewSpender} onResultChange={this.closeNewSpender.bind(this)}/>}
        {this.state.openNewAd && <NewAd districtid={this.state.districtid} showCreate={this.state.openNewAd} onResultChange={this.closeNewAd.bind(this)}/>}
      </div>
    );
  }
}

export default MediaBuys;
