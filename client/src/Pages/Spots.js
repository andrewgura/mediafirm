import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import NewAd from '../Components/Ads/NewAd';
import EditAd from '../Components/Ads/EditAd';
import DeleteAd from '../Components/Ads/DeleteAd';

class Spots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districtid: this.props.match.params.id,
      ads: [],
      currentAd: 0,
      openNewAd: false,
      openEditAd: false,
      deletePrompt: false
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/districtads' + this.props.match.params.id);
    await response.json().then(data => {
    let ads = data.ads.map(item => {
        return(
          <div>
            <button onClick={this.openEditAd.bind(this, item.adid)}>Edit</button><button onClick={this.openDeletePrompt.bind(this, item.adid)}>Delete</button><span>{item.description}</span>
          </div>
        )

      })
      this.setState({ads: ads});
    })
  }

  openNewAd(e){
    e.preventDefault();
    this.setState({openNewAd: true})
  }

  closeNewAd() {
    this.setState({openNewAd: false});
    this.componentDidMount();
  }

  openEditAd(id){
    this.setState({openEditAd: true, currentAd: id})
  }

  closeEditAd() {
    this.setState({openEditAd: false});
    this.componentDidMount();
  }

  openDeletePrompt(id) {
    this.setState({ currentAd: id, deletePrompt: true});
  }

  onDeleteClose() {
    this.setState({deletePrompt: false});
    this.componentDidMount();
  }


  render() {
    return (
      <div>
        <Button bsStyle="success" onClick={this.openNewAd.bind(this)}>New Spot</Button>
        {this.state.ads}
        {this.state.openNewAd && <NewAd districtid={this.state.districtid} showCreate={this.state.openNewAd} onResultChange={this.closeNewAd.bind(this)}/>}
        {this.state.openEditAd && <EditAd districtid={this.state.districtid} currentAd={this.state.currentAd} showEdit={this.state.openEditAd} onResultChange={this.closeEditAd.bind(this)}/>}
        {this.state.deletePrompt && <DeleteAd districtid={this.state.districtid} currentAd={this.state.currentAd} showDelete={this.state.deletePrompt} onResultChange={this.onDeleteClose.bind(this)}/>}
      </div>
    );
  }
}

export default Spots;
