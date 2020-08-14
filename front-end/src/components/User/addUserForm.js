import React, { Component } from 'react'
import {
  Button,
  Spinner, FormGroup,
  Input, FormText, Label,
  Form, Alert,
  Card, CardHeader, CardBody, Row, Col,Modal,ModalBody,ModalHeader,ModalFooter
} from 'reactstrap';

import axios from 'axios';
import Validator from 'validator';

class AddUserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      alertMessage: "",
      alertColor: "primary",
      name: "",
      lastName: "",
      password: "",
      passwordAgain: "",
      email: "",
      userNameMessage: "",
      lastNameMessage: "",
      emailMessage: "",
      passwordMessage: "",
      passwordRepeatMessage: "",
      messageModal:false,
      modalHeader:"",
      modalMessage:"",
      messageModalColor:""
    }
  }
  componentDidMount = () => {
    this.setState({ isLoaded: true });

  }
  closeMessageModal=()=>{
    this.setState({messageModal:false});
  }


  handleNameChange = (e) => {
    let { value } = e.target;
    this.setState({ name: value, userNameMessage: "" });

  }
  handleLastNameChange = (e) => {
    let { value } = e.target;
    this.setState({ lastName: value, lastNameMessage: "" });

  }
  handlePasswordChange = (e) => {
    let { value } = e.target;
    this.setState({ password: value, passwordMessage: "" });
  }
  handlePasswordAgainChange = (e) => {
    let { value } = e.target;
    this.setState({ passwordAgain: value, passwordRepeatMessage: "" });
  }
  handleEmailChange = (e) => {
    let { value } = e.target;
    this.setState({ email: value, emailMessage: "" });
  }
  clean = () => {
    this.setState({
      name: "",
      lastName: "",
      password: "",
      passwordAgain: "",
      email: ""

    })
  }

  cleanMessages = () => {
    this.setState({
      userNameMessage: "",
      lastNameMessage: "",
      emailMessage: "",
      passwordMessage: "",
      passwordRepeatMessage: "",
      alertMessage: "",
      alertColor: ""
    })
  }
  createUser = () => {

    this.cleanMessages();

    const { name, lastName, password, email, passwordAgain } = this.state;
    let validated = true;

    if(Validator.isEmpty(name)){

      this.setState({userNameMessage: "Lütfen kullanıcının ismini giriniz."})
      validated = false;
    }

    if(Validator.isEmpty(lastName)){
      this.setState({lastNameMessage: "Lütfen kullanıcının soyadını giriniz."})
      validated = false;
    }


    if(!Validator.isEmail(email) || Validator.isEmpty(email)){
      console.log('değilll')
      this.setState({emailMessage: "Lütfen mail adresi giriniz."})
      validated = false;
    }

    if(password.length < 6){
      this.setState({passwordMessage: "Şifre en az 6 karakter olmalıdır."})
      validated = false;
    }

    if(passwordAgain.length < 6){
      this.setState({passwordRepeatMessage: "Şifre en az 6 karakter olmalıdır."})
      validated = false;
    }

    if(password !== passwordAgain){
      this.setState({passwordRepeatMessage: "Şifreler farklı girilmiştir."})
      validated = false;
    }

    if (validated == true) {
      axios.post('http://localhost:3010/users/createuser', {

        first_name: this.state.name,
        last_name: this.state.lastName,
        password: this.state.password,
        email: this.state.email
      }).then(res => {
        this.setState({ modalMessage: "Kullanıcı başarıyla yaratılmıştır.", modalHeader:"Mesaj",messageModalColor:"blue", messageModal:true,alertColor: "primary" });
        this.clean();

      }).catch(err => {
        this.setState({ modalMessage:"Email sistemde bulunmaktadır. Lütfen farklı bir email adresi giriniz.", modalHeader:"Hata Mesajı",messageModalColor:"red",messageModal:true,alertColor: "danger" })
      });
    } 
  }

  render() {

    const { isLoaded, alertMessage, alertColor, name, lastName, password, email, error, passwordAgain } = this.state;
    const marginTop = {
      marginTop: "10px"
    };

    if (isLoaded == false) {
      return (<div>

        <Spinner color="primary" />
      </div>
      )
    } else if (error) {
      return (
        <div>

          <p>Verilere ulaşmaya çalışırken hata oluşmuştur.</p>
        </div>
      )

    } else {

      let alert;
      if (alertMessage !== "") {
        alert = (
          <div style={marginTop}>
            <Alert color={alertColor}>
              {alertMessage}
            </Alert>
          </div>
        )
      }

      return (



        <div style={marginTop}>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Kullanıcı Yarat
            </CardHeader>

                <CardBody>
                  <Form >

                    <FormGroup>
                      <Label for="firstName">İsim:*</Label>
                      <Input invalid = {this.state.userNameMessage} name="firstName" id="firstName" value={name} onChange={this.handleNameChange} />
                      <FormText>{this.state.userNameMessage}</FormText>
                    </FormGroup>

                    <FormGroup>
                      <Label for="lastName">Soyisim:*</Label>
                      <Input invalid = {this.state.lastNameMessage} name="lastName" id="lastName" value={lastName} onChange={this.handleLastNameChange} />
                      <FormText>{this.state.lastNameMessage}</FormText>
                    </FormGroup>

                    <FormGroup>
                      <Label for="Email">E-Posta:*</Label>
                      <Input invalid = {this.state.emailMessage} type="email" name="Email" id="Email" value={email} onChange={this.handleEmailChange} />
                      <FormText>{this.state.emailMessage}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <Label for="Password">Parola:*</Label>
                      <Input invalid = {this.state.passwordMessage} type="password" name="Password" id="Password" value={password} onChange={this.handlePasswordChange} />
                      <FormText>{this.state.passwordMessage}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <Label for="PasswordAgaing">Parola Tekrar:*</Label>
                      <Input invalid = {this.state.passwordRepeatMessage} type="password" name="PasswordAgain" id="PasswordAgain" value={passwordAgain} onChange={this.handlePasswordAgainChange} />
                      <FormText>{this.state.passwordRepeatMessage}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <Button onClick={this.createUser} color="primary">Kullanıcıyı Ekle</Button>
                    </FormGroup>
                  </Form>
                  {alert}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style = {{backgroundColor: this.state.messageModalColor, color: "white"}} toggle={this.closeMessageModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style = {{backgroundColor: this.state.messageModalColor, color: "white"}} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

        </div>


      );




    }


  }


}
export default AddUserComponent;
