import React, { Component } from "react";
import Home from './Home';
import { Button } from 'react-bootstrap';
import OpenMedia from './OpenMedia';
import {css} from "glamor";

class Ads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: {ads: []},
      people: [],
      openMedia: false,
      currentItem: '',
      currentType: '',
      currentItemId: 0,
      total: 0,
      trps: 0
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/allads' + this.props.clientid);
    const data = await response.json();

    var people = []; // eslint-disable-next-line
    let spenders = data.ads.map(item => {
      var a = item.person;

      if(people.indexOf(a) === -1){
        people.push(a);
      }
    })

    this.setState({ads: data, people: people});
  }

  setActive(item){
    this.setState({
      currentItemId: item.adid,
       total: item.total,
       trps: item.trps
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

  render() {

  const styles = {
      adContainer: css({
        background: '#f5f5f5',
        margin: "0 25px"
    }),
    headergroup: css({
      margin: "auto 8px",
      paddingTop: "15px",
      paddingBottom: "10px"
    }),
    wellStyle: css({
      backgroundColor: 'cornflowerblue !important'
    })
  }

  var { ads, people } = this.state;

    return (
    <div>
      <Home/>

      {people.map(group => {
        return(
      <div>
      <div className={styles.adContainer}>
        <h3 className={styles.headergroup}>{group}</h3>
          <div className="adsrowcontain">
        {/* eslint-disable-next-line */}
          {ads.ads.map(item => {
            if(item.person === group) {
                if(item.type === "Youtube") {
                  var src = "https://img.youtube.com/vi/" + item.mediaurl + "/0.jpg";
                  return(
                    <div className={this.state.currentItemId === item.adid  ? styles.wellStyle + " well well-sm" : "well well-sm"} onClick={this.setActive.bind(this, item)}>
                      <h3>Youtube</h3>
                      <img alt="" className="ad" src={src} />
                      <p><Button className="center-button" onClick={this.toggleOpenMedia.bind(this, item.mediaurl, item.type)}>View</Button></p>
                    </div>
                  )
                } else if(item.type === "Upload") {  // eslint-disable-next-line
                    var src = item.mediaurl + "#t=2";
                    return (
                      <div className={this.state.currentItemId === item.adid ? styles.wellStyle + " well well-sm" : "well well-sm"} onClick={this.setActive.bind(this, item)}>
                      <h3>Upload</h3>
                        <video className="ad" src={src} />
                        <p><Button className="center-button" onClick={this.toggleOpenMedia.bind(this, item.mediaurl, item.type)}>View</Button></p>
                      </div>
                    )
                } else {
                  return(
                      <div className={this.state.currentItemId === item.adid ? styles.wellStyle + " well well-sm" : "well well-sm"} onClick={this.setActive.bind(this, item)}>
                        <h3>Img</h3>
                        <img alt="" className="ad" src={item.mediaurl}/>
                        <p><Button className="center-button" onClick={this.toggleOpenMedia.bind(this, item.mediaurl, item.type)}>View</Button></p>
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
      })}
      {/* end of person mapping */}


    <h2>Total Spent: {this.state.total}</h2>
    <h2>Total TRPS: {this.state.trps}</h2>

    {this.state.openMedia && <OpenMedia openMedia={this.state.openMedia} media={this.state.currentItem} type={this.state.currentType} onResultChange={this.toggleCloseMedia.bind(this)}/>}
    </div>
    );
  }
}

export default Ads;
