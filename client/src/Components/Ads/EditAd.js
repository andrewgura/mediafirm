import React, { Component } from "react";
import { Modal, FormGroup, ControlLabel, FormControl, Row, Col, Button, Radio } from 'react-bootstrap';
import Dropzone from 'react-dropzone'
import axios from 'axios'

class EditAd extends Component {
  /* eslint-disable */
 constructor(props) {
   super(props);
   this.state = {
      showModal: this.props.showCreateAd,
      spenders: [],
      type: '',
      mediaurl: '',
      type: '',
      support: '',
      description: '',
      spenderid: 0
   }
 }

 async componentDidMount() {
   const response = await fetch('/api/ads' + this.props.currentAd);
   const data = await response.json();
    this.setState({
     description: data.ads[0].description,
     support: data.ads[0].support,
     type: data.ads[0].type,
     mediaurl: data.ads[0].mediaurl,
     spenderid: data.ads[0].spender
   })

   const responseSpender = await fetch('/api/spenders' + this.props.districtid + "/current" + this.state.spenderid);
   await responseSpender.json().then(data => {

   let spenders = data.spenders.map(item => {
       return(
         <option key={item.spenderid} value={item.spenderid}>{item.spender}</option>
       )
     })
     this.setState({spenders: spenders});
   })
 }

 modalClose() {
  this.setState({ showModal: false });
  this.props.onResultChange();
}

async createAd(e) {
  e.preventDefault();

  var body = {
    support: this.state.support,
    mediaurl: this.state.mediaurl,
    type: this.state.type,
    description: this.state.description,
    spenderid: this.state.spenderid,
    districtid: this.props.districtid
  }


  await fetch('/api/ads' + this.props.currentAd, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json'
    }
  })
  this.props.onResultChange();
}

handleChange(event){
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({[name]: value});
}

handleYoutube(event) {
  const target = event.target;
  const value = target.value;

    var youtubeid = function(url) {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = url.match(regExp);
      return (match&&match[7].length==11)? match[7] : false;
    }

    this.setState({mediaurl: youtubeid(value), mediatype: "Youtube"})
}

uploadVideo = file => {
  var file = file[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", `codeinfuse, medium, gist`);
    formData.append("upload_preset", "qdnhndlf"); // cloudinary preset name
    formData.append("api_key", "298489466487813");  // cloudinary api key
    formData.append("timestamp", (Date.now() / 1000) | 0);

  //
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    return axios.post("https://api.cloudinary.com/v1_1/codeinfuse/video/upload", formData, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
      }).then(response => {
      const data = response.data;
      const fileURL = data.secure_url // You should store this URL for future references in your app
      this.setState({mediaurl: fileURL, mediatype: "Video"})
    })

}

uploadImage = file => {

    var file = file[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", `codeinfuse, medium, gist`);
    formData.append("upload_preset", "qdnhndlf"); // cloudinary preset name
    formData.append("api_key", "298489466487813");  // cloudinary api key
    formData.append("timestamp", (Date.now() / 1000) | 0);


    return axios.post("https://api.cloudinary.com/v1_1/codeinfuse/image/upload", formData, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }).then(response => {
      const data = response.data;
      const fileURL = data.secure_url;
      this.setState({mediaurl: fileURL, mediatype: "Image"})
    })
}


 render() {
   return (
     <Modal show={this.props.showEdit} onHide={this.modalClose.bind(this)}>
       <Modal.Header closeButton>
        <Modal.Title>Edit Spot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <form onSubmit={this.createAd.bind(this)}>
      <FormGroup>

        <Row>
          <Col lg={6}><ControlLabel>Support Type</ControlLabel>
          <Row><Col lg={6}><Radio name="support" value="Friendly" defaultChecked={this.state.support == "Friendly" ? true : null} onChange={this.handleChange.bind(this)} inline>Friendly</Radio></Col></Row>
          <Row><Col lg={6}><Radio name="support" value="Unfriendly" defaultChecked={this.state.support == "Unfriendly" ? true : null} onChange={this.handleChange.bind(this)} inline>Unfriendly</Radio></Col></Row>
          </Col>

          <Col lg={6}><ControlLabel>Ad Name</ControlLabel>
          <FormControl required name="description" value={this.state.description} type="text" onChange={this.handleChange.bind(this)}/></Col>
        </Row>

        <Row>
          <Col lg={12}>  <ControlLabel>Spender</ControlLabel>
          <FormControl name="spenderid" componentClass="select" onChange={this.handleChange.bind(this)}>
            {this.state.spenders}
          </FormControl>
         </Col>
        </Row>

        <Row><Col lg={6}><ControlLabel>Media Source</ControlLabel></Col></Row>
        <Row><Col lg={6}><Radio name="type" defaultChecked={this.state.type == "Youtube" ? true : null} value="Youtube" onChange={this.handleChange.bind(this)} inline>Youtube</Radio></Col></Row>
        <Row><Col lg={6}><Radio name="type" defaultChecked={this.state.type == "Video" ? true : null} value="Video" onChange={this.handleChange.bind(this)} inline>Video Upload</Radio></Col></Row>
        <Row><Col lg={6}><Radio name="type" defaultChecked={this.state.type == "Image" ? true : null} value="Image" onChange={this.handleChange.bind(this)} inline>Image Upload</Radio></Col></Row>

          {this.state.type && this.state.type == "Youtube" ?
          <div>
            <Row><Col lg={6}><ControlLabel>Paste Youtube URL</ControlLabel>
            <FormControl required name="youtube" type="text" value={this.state.mediaurl} onChange={this.handleYoutube.bind(this)}/></Col></Row>
          </div> : null}


          {this.state.type && this.state.type == "Video" ?
          <div>
            <Row><Col lg={6}><ControlLabel>Upload Video</ControlLabel>
            <Dropzone
              className="fileUpload"
            onDrop={this.uploadVideo}
            multiple
            accept="video/*"

          >
          <p>Upload</p>
          </Dropzone>
          </Col></Row>

          {this.state.url ? <video src={this.state.url} type="video/mp4" controls/> : null}
          </div> : null}


          {this.state.type && this.state.type == "Image" ?
          <div>
          <Row><Col lg={6}><ControlLabel>Upload Image</ControlLabel>
          <Dropzone className="fileUpload"
          onDrop={this.uploadImage}
          multiple
          accept="image/*"

        >
          <p>Upload</p>
        </Dropzone>
        </Col></Row>
        {this.state.url ? <p><img alt="" src={this.state.url}/></p> : null}
        </div> : null}


        <Button bsStyle="primary" type="submit">Save</Button>
        <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
      </FormGroup>
      </form>
    </Modal.Body>
   </Modal>
   );
 }
}

export default EditAd;
