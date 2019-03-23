import React, { Component } from "react";
import { Panel } from 'react-bootstrap';
import MediaBuyDetails from "../MediaBuyDetails/MediaBuyDetails";

class ExpandSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: this.props.toggle
    }
  }

  render() {
    const { startdate, enddate } = this.props;
    return (
    <React.Fragment>
    <Panel onToggle={()=>{}} expanded={this.props.toggle}>
      <Panel.Collapse>
          <MediaBuyDetails type={this.props.type} startdate={startdate} enddate={enddate} buyid={this.props.buyid} id={this.props.id} market={this.props.market}/>
      </Panel.Collapse>
    </Panel>

    </React.Fragment>
    )
  }
}

export default ExpandSection;
