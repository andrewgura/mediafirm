import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavBarHome from "../Components/NavBarHome"

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districts: []
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/districts');
    await response.json().then(data => {
    let districts = data.districts.map(item => {
        return(
          <div key={item.districtid}>
            <Link className="btn btn-primary" to={{ pathname: `/district/${item.districtid}`}}>View</Link>
            <span style={{fontSize: "x-large", fontWeight: "bold"}}>{item.districtcode} ({item.type})</span><Link className="btn btn-info" to={{ pathname: `/districtinfo/${item.districtid}`}}>District Info</Link>
          </div>
        )
      })
      this.setState({districts: districts});
    })
  }

  render() {
    return (
      <div>
        <NavBarHome/>
        {this.state.districts}
      </div>
    );
  }
}

export default Clients;
