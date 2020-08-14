import React, { Component } from 'react'
import {
    Button, Spinner, FormGroup, Input, Container,
    Label, Form, Alert, Table, Modal, ModalHeader, ModalBody, ModalFooter,
    CardHeader, Card, CardBody, Row, Col, FormText
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator'

class ViewAcconutComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            error: "",
            newPassword: "",
            newPasswordRepeat: "",
            alertMesssage: "",
            alertColor: "",
            newPasswordMessage: "",
            newPasswordRepeatMessage: "",
            modalHeader: "",
            modalMessage: "",
            messageModal: false,
            messageModalColor: "",
        }
    }
    componentDidMount = () => {

        this.getUser();

    }

    clearForm = () => {
        this.setState({
            newPassword: "",
            newPasswordRepeat: ""
        })
    }

    clearMessages = () => {
        this.setState({
            alertMessage: "",
            alertColor: "",
            newPasswordMessage: "",
            newPasswordRepeatMessage: "",
        })
    }

    clearModal = () => {
        this.setState({
            modalHeader: "",
            modalMessage: "",
            messageModal: false,
            messageModalColor: "",
        })
    }

    handleNewPasswordChange = (e) => {
        let { value } = e.target;
        this.clearMessages();
        this.setState({ newPassword: value });
    }
    handleNewPasswordRepeatChange = (e) => {
        let { value } = e.target;
        this.clearMessages();
        this.setState({ newPasswordRepeat: value });
    }

    closeMessageModal = () => {
        this.clearModal();
        this.setState({ messageModal: false });
    }

    changePassword = () => {

        let validated = true;
        const { newPassword, newPasswordRepeat } = this.state

        if (newPassword.length < 6) {
            validated = false;
            this.setState({ newPasswordMessage: "Şifre en az 6 karakter olmalıdır." })
        }

        if (newPasswordRepeat.length < 6) {
            validated = false;
            this.setState({ newPasswordRepeatMessage: "Şifre en az 6 karakter olmalıdır." })
        }

        if (newPassword !== newPasswordRepeat) {
            validated = false;
            this.setState({ newPasswordRepeatMessage: "Şifreler aynı girilmemiştir.", newPasswordMessage: "" })
        }

        if (validated === true) {
            let data = new FormData();
            data.append('user_id', this.state.user.id);
            data.append('password', this.state.newPassword);

            axios.put(`http://localhost:3010/authcommon/changepassword`,

                data

            ).then(res => {
                this.setState({ modalMessage:"Şifreniz başarıyla güncellenmiştir.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true });
                this.clearForm();

            }).catch(err => {
                this.setState({ modalMessage:"Şifreniz önceki şifrenizle aynıdır, lütfen yeni şifre giriniz.", modalHeader:"Hata Mesajı", messageModalColor:"red",messageModal:true })
                this.clearForm();
                this.clearMessages();
            });
        }
    }

    getUser = () => {
        axios.get('http://localhost:3010/authcommon/getuser').then(res => {
            const user = res.data;
            console.log(user);
            this.setState({ user: user, isLoaded: true });
        }).catch(err => {
            this.setState({ error: err, isLoaded: true })
        });
    }
    render() {

        const user = this.state.user;

        return (
            <div>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Kullanıcı Bilgileri
                      </CardHeader>
                            <CardBody>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>İsim</th>
                                            <th>Soyisim</th>
                                            <th>E-mail</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        <tr key={user.id}>
                                            <td>{user.first_name}</td>
                                            <td>{user.last_name}</td>
                                            <td>{user.email}</td>
                                        </tr>

                                    </tbody>
                                </Table>


                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Şifre Değiştir
                      </CardHeader>
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="courseName">Yeni Şifre:</Label>
                                        <Input invalid={this.state.newPasswordMessage} type="password" name="moduleName" id="moduleName" value={this.state.newPassword} onChange={this.handleNewPasswordChange} />
                                        <FormText>{this.state.newPasswordMessage}</FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">Yeni Şifre Tekrar: </Label>
                                        <Input invalid={this.state.newPasswordRepeatMessage} type="password" name="moduleDesc" id="moduleDesc" value={this.state.newPasswordRepeat} onChange={this.handleNewPasswordRepeatChange} />
                                        <FormText>{this.state.newPasswordRepeatMessage}</FormText>
                                    </FormGroup>

                                    <FormGroup>
                                        <Button color="primary" onClick={this.changePassword}>Şifreyi Değiştir</Button>
                                    </FormGroup>
                                </Form>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style={{ backgroundColor: this.state.messageModalColor, color: "white" }} toggle={this.closeMessageModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.messageModalColor, color: "white" }} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default ViewAcconutComponent;
