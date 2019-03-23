import React, { Component } from "react";
import Ads from "../Components/Ads/Ads"
import NavBar from "../Components/NavBar"

class DistrictView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districtid: this.props.match.params.id,
      districts: []
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/districts' + this.state.districtid);
    await response.json().then(data => {
    let districts = data.districts.map(item => {
        return(
            <h1 key={item.districtid}>{item.districtcode}</h1>
        )

      })
      this.setState({districts: districts});
    })
  }


  render() {
    return (
      <div>
        <NavBar districtid={this.state.districtid}/>
          {this.state.districts}

          <Ads districtid={this.state.districtid}/>

      </div>
    );
  }
}

export default DistrictView;
