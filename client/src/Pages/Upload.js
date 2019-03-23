import React, { Component } from "react";
import Dropzone from 'react-dropzone'
import axios from 'axios'

class Upload extends Component {
  constructor(props) {
      super(props);

      this.state = {
        fileURL: ''
      };
    }

    uploadImage = file => {
 // eslint-disable-next-line
      var file = file[0];
      // const uploaders = files.map(file => {
      //   // Initial FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tags", `codeinfuse, medium, gist`);
        formData.append("upload_preset", "qdnhndlf"); // cloudinary preset name
        formData.append("api_key", "298489466487813");  // cloudinary api key
        formData.append("timestamp", (Date.now() / 1000) | 0);

      //
        // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
        return axios.post("https://api.cloudinary.com/v1_1/codeinfuse/image/upload", formData, {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        }).then(response => {
          const data = response.data;
          const fileURL = data.secure_url // You should store this URL for future references in your app
          this.setState({fileURL: fileURL})
        })
      // });



    }

    render() {
      return (
    <div>
        <Dropzone className="fileUpload"
        onDrop={this.uploadImage}
        multiple
        accept="image/*"

      >
        <p>Upload</p>
      </Dropzone>
      <p>{this.state.fileURL}</p>
      <p><img alt="" src={this.state.fileURL}/></p>
    {/* <video src={this.state.fileURL} type="video/mp4" controls/> */}
  </div>
      );
    }
  }

export default Upload;
