import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Row, Col, Button, Grid } from 'react-bootstrap';

class Login extends Component {
 constructor(props) {
 /* eslint-disable */
   super(props);
   this.state = {
     name: '',
     password: ''
   }
 }

 handleChange(event){
   const target = event.target;
   const value = target.value;
   const name = target.name;
   this.setState({[name]: value});
 }


 async login(e) {
   e.preventDefault();

   var body = {
     name: this.state.name,
     password: this.state.password
   }

   console.log(body)

   await fetch('/api/login', {
   method: 'POST',
   body: JSON.stringify(body),
   headers: {
     'Content-Type': 'application/json'
     }
   })

 }

 render() {

   return (
     <div>
       <form onSubmit={this.login.bind(this)}>
      <FormGroup>
        <h2>Login</h2>
        <Grid>
        <Row>
          <Col lg={6}>  <ControlLabel>Login</ControlLabel>
        <FormControl required name="name" type="text" onChange={this.handleChange.bind(this)}/></Col></Row>

        <Row>
        <Col lg={6}>  <ControlLabel>Password</ControlLabel>
        <FormControl required name="password" type="password" onChange={this.handleChange.bind(this)}/></Col>
        </Row>
      </Grid>

        <Button bsStyle="primary" type="submit">Login</Button>
        <Button onClick={() => this.props.onResultChange()}>Cancel</Button>
      </FormGroup>
      </form>
    </div>
   );
 }
}

export default Login;
