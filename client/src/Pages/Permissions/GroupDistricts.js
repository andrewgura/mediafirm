import React, { Component } from "react";
import { ListGroupItem } from 'react-bootstrap';

class GroupDistricts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      districts: []
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/GroupDistricts' + this.props.group);

    await response.json().then(data => {

      var districts = [];
      data.data.map(item => {
          districts.push(<ListGroupItem>{item.districtcode} <i onClick={this.removeDistrict.bind(this, item)} className="fa fa-ban"/></ListGroupItem>)
      })

      this.setState({districts: districts});
    })
  }

  async removeDistrict(item) {
    await fetch('/api/GroupDistricts' + item.groupdistrictid, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
        }
      })
      this.componentDidMount();
  }

  render() {
    const { districts } = this.state;
    return (
        districts
    );
  }
}

export default GroupDistricts;
