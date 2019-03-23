import React, { Component } from "react";

class DistrictInfo extends Component {
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
          <div>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>Cycle: </span><span style={{fontSize: "18px"}}>{item.cycle}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>Type: </span><span style={{fontSize: "18px"}}>{item.type}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>Cycle Years: </span><span style={{fontSize: "18px"}}>{item.cycleyears}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>State: </span><span style={{fontSize: "18px"}}>{item.state}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>District Code: </span><span style={{fontSize: "18px"}}>{item.districtcode}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>Incumbent Name: </span><span style={{fontSize: "18px"}}>{item.incumbentfirst} {item.incumbentlast}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>Incumbent Party: </span><span style={{fontSize: "18px"}}>{item.incumbentparty}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>Filling Website: </span><span style={{fontSize: "18px"}}>{item.filingwebsite}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>Filling Date: </span><span style={{fontSize: "18px"}}>{item.filingdate}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>Primary Date: </span><span style={{fontSize: "18px"}}>{item.primarydate}</span></p>
            <p><span style={{fontWeight: "bold", fontSize: "28px"}}>General Date: </span><span style={{fontSize: "18px"}}>{item.generaldate}</span></p>
          </div>
        )

      })
      this.setState({districts: districts});
    })
  }


  render() {
    return (
      <div>
        {this.state.districts}
      </div>
    );
  }
}

export default DistrictInfo;
