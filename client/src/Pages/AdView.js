import React, { Component } from "react";
import Home from './Home';
import { FormControl } from 'react-bootstrap';

class AdView extends Component {
 constructor(props) {
   super(props);
   this.state = {
     ad: [],
     buydetails: [],
     adid: this.props.location.state.adid,
     mediabuys: [],
     mediabuyid: 0,
     buybreakdown: [],
     breakdownid: 0
   }
 }

 async componentDidMount() {
   const response = await fetch('/api/ads' + this.props.location.state.adid);
   await response.json().then(data => {
     let ad = data.ads.map(item => {
       return(
         <div key={item.adid}>
           <p>{item.adid}</p>
           <p>{item.description}</p>
           <p>{item.image}</p>
         </div>
       )
     })
     this.setState({ad: ad});
   })

  const adBuy = await fetch('/api/adBuy' + this.props.location.state.adid);
   await adBuy.json().then(data => {
     let buydetails = data.ads.map(item => {
       return(
         <div key={item.breakdownid}>
         <h3>buydetailbreakdown</h3>
         <span>{item.breakdownid} | </span><span>{item.percent} | </span><span>{item.date}</span>
        </div>
       )
     })
     this.setState({buydetails: buydetails});
   })

//Get All media buys
   const getBuys = await fetch('/api/mediabuys');
   await getBuys.json().then(data => {
     let mediabuys = data.mediabuys.map(item => {
       return(
           <option key={item.mediabuyid} value={item.mediabuyid}>{item.mediabuyid} - {item.type} - {item.spender}</option>
       )
     })
     this.setState({mediabuys: mediabuys});
   })

 }

 async handleChange(event){
   const target = event.target;
   const value = target.value;
   const name = target.name;
   await this.setState({[name]: value});
   this.showBuyDetailBreakDown();
 }

//After mediabuy is selected, run function to get buybreakdowns related to buy
 async showBuyDetailBreakDown(){
   const getBuyBreakdown = await fetch('/api/breakdown' + this.state.mediabuyid);
   await getBuyBreakdown.json().then(data => {
     let buybreakdown = data.breakdown.map(item => {
       return(
           <option key={item.breakdownid} value={item.breakdownid}>{item.date} - {item.percent}%</option>
       )
     })
     this.setState({buybreakdown: buybreakdown});
   })
 }

 async addBreakdown(){
   var body = {
     adid: this.state.adid,
     breakdownid: this.state.breakdownid
   }
   fetch('/api/breakdown',{
     method: 'PUT',
     body: JSON.stringify(body),
     headers: {
       'Content-Type': 'application/json'
     }
   })
   this.setState({mediabuyid: 0})
   this.componentDidMount();
 }

render() {
   return (
     <div>
       <Home/>
       <h1>GGGG</h1>
       {this.state.ad}

       {this.state.buydetails.length > 0 ? this.state.buydetails :
       <FormControl name="mediabuyid" componentClass="select" onChange={this.handleChange.bind(this)}>
          <option></option>
           {this.state.mediabuys}
         </FormControl> }


        {this.state.mediabuyid ?
          <div>
          <FormControl name="breakdownid" componentClass="select" onChange={this.handleChange.bind(this)}>
            <option></option>
             {this.state.buybreakdown}
           </FormControl>
          <button onClick={this.addBreakdown.bind(this)}>Save</button>
         </div>
           : null}

     </div>
   );
 }
}

export default AdView;
