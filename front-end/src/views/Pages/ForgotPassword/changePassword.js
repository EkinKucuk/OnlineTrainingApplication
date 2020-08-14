import React, { Component } from 'react';
import {
    Button, Card, CardBody, CardGroup, Col, Container,
    Form, Input, InputGroup, InputGroupAddon,
    InputGroupText, Row, FormText, Alert, Label, FormGroup, FormFeedback
} from 'reactstrap';
import './main.css'
import Validator from 'validator'
import setAuthToken from '../../../helpers/setAuthToken';
import axios from 'axios'

class ChangePasswordComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            alertMessage: "",
            password: "",
            rePassword: "",
            error: null,
            isLoaded: false
        }
    }
    componentDidMount() {

    }
    changePasswordButtonPressed = (e) => {
        e.preventDefault();
        this.setState({ error: null, alertMessage: "", isLoaded: true });
        const { password, rePassword } = this.state;
        let validated = true;
        if(Validator.isEmpty(password)){
            validated=false
            this.setState({alertMessage:"Lütfen yeni şifreyi giriniz."})
        }
        if(password.length<6){
            validated=false
            this.setState({alertMessage:"Şifre minimum 6 karakter olmalıdır."})
        }
        if(rePassword.length<6){
            validated=false
            this.setState({alertMessage:"Şifre minimum 6 karakter olmalıdır."})
        }
        if(Validator.isEmpty(rePassword)){
            validated=false
            this.setState({alertMessage:"Lütfen yeni şifreyi tekrar giriniz."})
        }
        if (password !== rePassword) {
            validated = false;
            this.setState({alertMessage:"Lütfen şifreyi iki defa doğru girdiğinize emin olun."})
        }
        if(validated){
            axios.put(`http://localhost:3010/user/changepassword`, {
                password: password,
                user_id: this.props.user_id
            })
            .then(res => {
                this.getCourseTypes();
                this.setState({ alertMessage: "Şifre başarıyla değiştirilmiştir."});
            })
            .catch(err => {
                this.setState({ modalMessage: "Problem yaşanmıştır." })
            });
        }

    }
    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value, error: null })
    }
    handleRePasswordChange = (e) => {
        this.setState({ rePassword: e.target.value, error: null })
    }
    render() {


        if (isLoaded == false) {
            return (<div>

                <Spinner color="primary" />
            </div>)
        } else if (error) {
            return (<div>

                <p>Verilere ulaşmaya çalışırken hata oluşmuştur.</p>
            </div>)

        } else {
            let alert;
            if (alertMessage !== "") {
                alert = (<div style={alertStyle}>
                    <Alert color={alertColor}>
                        {alertMessage}
                    </Alert>
                </div>)
            }

            return (<div>
                <Container>
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <Form onSubmit={this.changePasswordButtonPressed}>
                                        <InputGroup style={{ marginTop: "20px" }} className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" name="password" onChange={this.handlePasswordChange} value={this.state.password} placeholder="Şifre:" />
                                        </InputGroup>
                                        <InputGroup style={{ marginTop: "20px" }} className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" name="rePassword" onChange={this.handleRePasswordChange} value={this.state.rePassword} placeholder="Şifre-tekrar:" />
                                        </InputGroup>
                                        <Row>
                                            <Col xs="6">
                                                <Button type="submit" color="primary" className="px-4">Şifremi Değiltir</Button>
                                            </Col>

                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                {alert}
            </div>)

        }


    }

}
export default ChangePasswordComponent;