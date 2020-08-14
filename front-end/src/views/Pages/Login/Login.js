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
      email: "",
      password: "",
      message: "",
      loading: false
    }
  }

  changePassword = () => {
    console.log('burdayız hocam');
    this.props.history.push('/forgotpassword');
  }
  

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
      error: null
    })
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
      error: null
    })
  }

  loginButtonPressed = (e) => {
    
    e.preventDefault();
    this.setState({ error: "", emailMessage: "", passwordMessage: "", loading: true });
    const { email, password} = this.state;
    let validated = true;

    if (!Validator.isEmail(email)){
        validated = false;
        this.setState({ emailMessage: "Lütfen emailinizi giriniz.", loading: false})
    }
    if (Validator.isEmpty(password)){
        validated = false;
        this.setState({ passwordMessage: "Lütfen şifrenizi giriniz.", loading: false})
    }

    if(validated == true){

      axios.post(`http://localhost:3010/login`, {
        email: email,
        password: password
      })
      .then(res => {
          
          const { token } = res.data;
          setAuthToken(token);
          localStorage.setItem('jwtToken', token);

          axios.get(`http://localhost:3010/authcommon/getuserpermissions`, {
         
          })
          .then(result2 => {
              localStorage.setItem('permissions', result2.data);
              this.props.history.push('/dashboard'); 
          })
          .catch(error => {
              this.setState({ error: "Sistemsel bir hata oluşmuştur.", password: "", loading: false })
          })
          
      })
      .catch(error => {
          this.setState({ error: "Email veya şifre yanlış girilmiştir.", password: "", loading: false })
          
      })

      
    }

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
        <p style = {{marginTop: "20px"}}>Giriş yapılıyor..</p>
      )
    }
    

    return (
      <div className="container-background">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.loginButtonPressed}>
                      <h1>ICterra Eğitim Platformu</h1>
                      <InputGroup style = {{marginTop: "20px"}} className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" name="email" onChange={this.handleEmailChange} value={this.state.email} placeholder="Email" autoComplete="username" />
                       
                      </InputGroup>

            
                       {this.state.emailMessage}
                
                     
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" name="password" onChange={this.handlePasswordChange} value={this.state.password} placeholder="Parola" autoComplete="current-password" />
          
                      </InputGroup>

                      {this.state.passwordMessage}

                     
                      <Row>
                        <Col xs="6">
                          <Button type="submit" color="primary" className="px-4">Giriş Yap</Button>
                        </Col>

                        
                       
                      </Row>
                    </Form>
                    
                    {alert}
                    
                  </CardBody>
                </Card>

              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}



export default Login;
