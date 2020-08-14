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
    this.state = {

      message: "",
      loading: false,
      error:null,
      mailConfirmed: false
    }
  }

  loginButtonPressed = (e) => {
    
    e.preventDefault();
    this.setState({ error: "", emailMessage: "", passwordMessage: "", loading: true });
    const { token } = this.state;
    let validated = true;

    if (!Validator.isEmpty(token)){
        validated = false;
        this.setState({ emailMessage: "Lütfen tokeni giriniz.", loading: false})
    }

    

    if(validated == true){

      axios.post(`http://localhost:3010/confirmtoken`, {
        token: token,
      })
      .then(res => {
          
        const result = res.data;
        this.setState({ loading: false, mailConfirmed: true})

      })
      .catch(error => {
          this.setState({ error: "Token hatalı girilmiştir.", loading: false })   
      })

      
    }
    

  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
      error: null
    })
  }

  componentDidMount() {
    
  }


  render() {
    let alert;

    if (this.state.error){
      alert = (
        <Alert style = {{marginTop: "20px"}} color = "danger">{this.state.error}</Alert>
      )
    }

    if (this.state.loading && !this.state.error){
      alert = (
        <p style = {{marginTop: "20px"}}>Mail kontrol ediliyor..</p>
      )
    }
    
    let card = (
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.loginButtonPressed}>
                      <h1>Şifreyi Değiştir</h1>
                      <InputGroup style = {{marginTop: "20px"}} className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" name="email" onChange={this.handleEmailChange} value={this.state.email} placeholder="Email" autoComplete="email" />
                       
                      </InputGroup>

            
                       {this.state.emailMessage}
    

                      <Row>
                        <Col xs="6">
                          <Button type="submit" color="primary" className="px-4">Mail Gönder</Button>
                        </Col>
                       
                      </Row>
                    </Form>
                    
                    {alert}
                    
                  </CardBody>
                </Card>

              </CardGroup>
            </Col>
    )

    if (this.state.mailConfirmed == true){
        card = (
          <p>Some shit.</p>
        )
    }

    return (
        {card}
    );
  }
}



export default Login;
