import React, { Component } from "react";
import { ListGroupItem } from 'react-bootstrap';

class GroupUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/groupUsers' + this.props.group);

    await response.json().then(data => {

      var users = [];
      data.data.map(item => {
          users.push(<ListGroupItem>{item.firstname} {item.lastname} <i onClick={this.removeUser.bind(this, item)} className="fa fa-ban"/></ListGroupItem>)
      })

      this.setState({users: users});
    })
  }


  async removeUser(item) {
    await fetch('/api/groupuser' + item.groupuserid, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
        }
      })
      this.componentDidMount();
  }

  render() {
    const { users } = this.state;
    return (
        users
    );
  }
}

export default GroupUsers;
