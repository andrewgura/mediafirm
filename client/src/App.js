import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Home from './Pages/Home';
import MediaBuys from './Pages/MediaBuys';
import Spots from './Pages/Spots';
import AdView from './Pages/AdView';
import Districts from './Pages/Districts';
import DistrictInfo from './Pages/DistrictInfo';
import DistrictView from './Pages/DistrictView';
import MediaMarkets from "./Pages/MediaMarkets"
import GroupManager from "./Pages/Permissions/GroupManager"
import Upload from './Pages/Upload';
import Login from './Pages/Login';
import './Styles.css'
import './BootStrapOverride.css'

class App extends Component {
  render() {
    return (
      <div>
          <Route path="/" exact component={Home}/>
          <Route path="/up" exact component={Upload}/>

          <Route path="/login" exact component={Login}/>

          <Route path="/districts" exact component={Districts}/>
          <Route path="/district/:id" exact component={DistrictView}/>
          <Route path="/districtinfo/:id" exact component={DistrictInfo}/>

          <Route path="/district/mediabuys/:id" exact component={MediaBuys}/>
          <Route path="/district/spots/:id" exact component={Spots}/>

          <Route path="/mediamarkets/" exact component={MediaMarkets}/>
          <Route path="/mediamarkets/:id" exact component={MediaBuys}/>

          <Route path="/manager" exact component={GroupManager}/>


          <Route path="/adView" component={AdView}/>
      </div>
    );
  }
}

export default App;
