import React, { Component } from "react";
import { Link } from "react-router-dom";

class MediaMarkets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediamarkets: []
    }
  }

  async componentDidMount() {
    const response = await fetch('/api/mediamarkets');
    await response.json().then(data => {
    let mediamarkets = data.mediamarkets.map(item => {
        return(
          <div key={item.marketid}>
            <Link className="btn btn-primary" to={{ pathname: `/mediamarkets/${item.marketid}`}}>{item.market}</Link>
          </div>
        )
      })
      this.setState({mediamarkets: mediamarkets});
    })
  }

  render() {
    return (
      <div>
        {this.state.mediamarkets}
      </div>
    );
  }
}

export default MediaMarkets;
