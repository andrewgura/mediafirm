import React, { Component } from "react";
import { Modal } from 'react-bootstrap';

class OpenMedia extends Component {
 constructor(props) {
   super(props);
   this.state = {
      showModal: this.props.openMedia,
      view: []
   }
 }

 async componentDidMount() {
   var url = this.props.media;
   var type = this.props.type;

   if(type === "Image"){
      var view = <img alt="" width="100%" src={url}/>;

   } else if(type === "Youtube") {
      var youtubeurl = "https://www.youtube.com/embed/" + url; // eslint-disable-next-line
      var view = <iframe width="100%" height="400px" src={youtubeurl} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>;
   } else {  // eslint-disable-next-line
     var view = <video controls width="100%" src={url} />
   }

   this.setState({view: view})


 }

 modalClose() {
  this.setState({ showModal: false });
  this.props.onResultChange();
}

 render() {
   return (
     <Modal show={this.props.openMedia} onHide={this.modalClose.bind(this)}>
       {this.state.view}
   </Modal>
   );
 }
}

export default OpenMedia;
