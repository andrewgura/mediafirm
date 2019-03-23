import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import OpenMedia from './OpenMedia';
import {css} from "glamor";
import SpenderSummary from "../../Excel/SpenderSummary";
import SpenderBox from "./OnScreenTables/SpenderBox"

class Ads extends Component {
/* eslint-disable */
  constructor(props) {
    super(props);
    this.state = {
      ads: {ads: []},
      people: [],
      adids: [],
      openMedia: false,
      currentItem: '',
      currentType: '',
      currentItemId: 0,
      total: 0,
      trps: 0,
      broadcast: 0,
      cable: 0,
      radio: 0,
      flightdates: '',
      Primary: false,
      General: false,
      electiontypes: ["Primary", "General"]
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/allads' + this.props.districtid);
    const data = await response.json();

    var people = []; // eslint-disable-next-line
    let spenders = data.ads.map(item => {
      var a = [item.support, item.electiontype];


      if(people.toString().indexOf(item.support) == -1) {
        people.push(a)
      }

    })

    var adids = [];
    data.ads.map(item => {
      adids.push(item.adid)
    })

    this.setState({ads: data, people: people, adids: adids});

  }

  setActive(item){
    this.setState({
      currentItemId: item.adid,
       total: item.amount,
       trps: item.trps,
       broadcast: item.broadcast,
       cable: item.cable,
       radio: item.radio,
       flightdates: item.earliest + " - " + item.latest
     })
  }

  toggleOpenMedia(url, type) {
    this.setState({openMedia: true, currentItem: url, currentType: type})
  }

  toggleCloseMedia() {
    this.setState({openMedia: false})
  }

  async createAd(e){
     e.preventDefault();
     await fetch('/api/ads', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
       }
     })
     this.componentDidMount();
   }


  youtubeId(url){  // eslint-disable-next-line
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length===11)? match[7] : false;
   }

   changeTab(e, item) {

     var i, tabcontent, tablinks;
     tabcontent = document.getElementsByClassName("tabcontent");

     for (i = 0; i < tabcontent.length; i++) {
       tabcontent[i].style.display = "none";
     }

     tablinks = document.getElementsByClassName("tablinks");

     for (i = 0; i < tablinks.length; i++) {
       tablinks[i].className = tablinks[i].className.replace(" active", "");
     }

     document.getElementById(e).style.display = "block";
     item.currentTarget.className += " active";

   }

render() {

  const styles = {
      adContainer: css({
        background: '#f5f5f5',
        margin: "0 25px"
    }),
    headergroup: css({
      margin: "0",
      padding: "10px",
      background: "#F0F2F0",
      background: "-webkit-linear-gradient(to left, #6f7386, #bec3be)",
      background: "linear-gradient(to left, #6f7386, #bec3be)",
      backgroundAttachment: "fixed"

    }),
    wellStyle: css({
      backgroundColor: 'cornflowerblue !important'
    })
  }

  var { ads, people, electiontypes } = this.state;
    return (
    <div>
      <div className="tab">
        <button className="tablinks active" onClick={this.changeTab.bind(this, "Primary")}>Primary</button>
        <button className="tablinks" onClick={this.changeTab.bind(this, "General")}>General</button>
      </div>

    {electiontypes.map((type, index) => {
      return(
      <div className={index == 1 ? "tabcontent" : "tabcontent firsttab"} key={type} id={type}>

        <h3>{type}</h3>
        <div style={{height: "400px"}}>
        <div style={{float: "right", display: "flex"}}>
          <SpenderBox type={type} districtid={this.props.districtid}/>
          <SpenderSummary adids={this.state.adids} type={type} districtid={this.props.districtid}/>
        </div>
        </div>

          {people.map(group => {
            if(group[1] == type) {
            return(
              <div key={group} style={{height: "260px", marginBottom: "10px"}}>
              <div className={styles.adContainer}>
                <h3 className={styles.headergroup}>{group[0]}</h3>
                  <div className="adsrowcontain">
                  {ads.ads.map(item => {
                    if(item.support === group[0] && item.electiontype == type) {
                        if(item.type === "Youtube") {
                          var src = "https://img.youtube.com/vi/" + item.mediaurl + "/0.jpg";
                          return(
                            <div key={item.adid} className={this.state.currentItemId === item.adid  ? styles.wellStyle + " well well-sm" : "well well-sm"} onClick={this.setActive.bind(this, item)}>
                              <h3 className="text-center" style={{marginTop: "2px"}}>{item.description}</h3>
                              <img alt="" className="ad" src={src} />
                              <Button className="center-button" onClick={this.toggleOpenMedia.bind(this, item.mediaurl, item.type)}>View</Button>
                            </div>
                          )
                        } else if(item.type === "Video") {  // eslint-disable-next-line
                            var src = item.mediaurl + "#t=2";
                            return (
                              <div key={item.adid} className={this.state.currentItemId === item.adid ? styles.wellStyle + " well well-sm" : "well well-sm"} onClick={this.setActive.bind(this, item)}>
                              <h3 className="text-center" style={{marginTop: "2px"}}>{item.description}</h3>
                                <video className="ad" src={src} />
                                <Button className="center-button" onClick={this.toggleOpenMedia.bind(this, item.mediaurl, item.type)}>View</Button>
                              </div>
                            )
                        } else {
                          return(
                              <div key={item.adid} className={this.state.currentItemId === item.adid ? styles.wellStyle + " well well-sm" : "well well-sm"} onClick={this.setActive.bind(this, item)}>
                                <h3 className="text-center" style={{marginTop: "2px"}}>{item.description}</h3>
                                <img alt="" className="ad" src={item.mediaurl}/>
                                <Button className="center-button" onClick={this.toggleOpenMedia.bind(this, item.mediaurl, item.type)}>View</Button>
                              </div>
                          )
                        }
                      }
               })}
               {/* end of ad mapping */}
            </div>


            </div>
            <p></p>

          </div>
          )
        }
        })}
          {/* end of person mapping */}

        <div className="adDetailsContain">
          <div style={{background: "#a99818"}} className="well adDetail"><p className="adDetailHeader">Total Spent</p><p className="adDetailInfo">{this.state.total}</p></div>
          <div style={{background: "#a99818"}} className="well adDetail"><p className="adDetailHeader">Total TRPS</p><p className="adDetailInfo">{this.state.trps}</p></div>
          <div style={{background: "#0087ff"}} className="well adDetail"><p className="adDetailHeader">Total Broadcast</p><p className="adDetailInfo">{this.state.broadcast}</p></div>
          <div style={{background: "#0087ff"}} className="well adDetail"><p className="adDetailHeader">Total Cable</p><p className="adDetailInfo">{this.state.cable}</p></div>
          <div style={{background: "#0087ff"}} className="well adDetail"><p className="adDetailHeader">Total Radio</p><p className="adDetailInfo">{this.state.radio}</p></div>
          <div style={{background: "#0087ff"}} className="well adDetail"><p className="adDetailHeader">Flight Dates</p><p className="adDetailInfo">{this.state.flightdates}</p></div>
        </div>

        {this.state.openMedia && <OpenMedia openMedia={this.state.openMedia} media={this.state.currentItem} type={this.state.currentType} onResultChange={this.toggleCloseMedia.bind(this)}/>}


      </div>
        )
        })}
    </div>
    );
  }
}

export default Ads;
