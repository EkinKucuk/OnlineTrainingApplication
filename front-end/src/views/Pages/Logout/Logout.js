import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardGroup, Col, Container,
  Form, Input, InputGroup, InputGroupAddon,
  InputGroupText, Row, FormText, Alert, Label, FormGroup, FormFeedback
} from 'reactstrap';
import './main.css'
import Validator from 'validator'
import setAuthToken  from '../../../helpers/setAuthToken';
import axios from 'axios'

class Login extends Component {


  constructor(props) {
    super(props);
  }

  componentDidMount() {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    this.props.history.push('/');
  }


  render() {

    return (
      <p>Logout</p>
    );
  }
}



export default Login;
