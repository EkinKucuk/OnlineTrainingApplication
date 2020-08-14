import React, { Component } from 'react'
import {
    Button, Spinner, Container, FormGroup, Input,
    Label, Form, Alert, Table, Nav, NavItem, NavLink, Card, Modal, ModalHeader, ModalFooter, ModalBody, FormText,
    CardHeader, CardBody, Row, Col
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator'
import { MDBDataTable } from 'mdbreact';

class UserOperationComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            users: [],
            chosenUserId: "",
            chosenUserName: "",
            chosenUserLastName: "",
            chosenUserEmail: "",
            oldUserName: "",
            oldUserLastName: "",
            oldUserEmail: "",
            modal: false,
            modal2: false,
            modalMessage: "",
            alertMessage: "",
            chosenTab: 1,
            userNameMessage: "",
            lastNameMessage: "",
            emailMessage: "",
            areYouSureModal: false,
            messageModal: false,
            successModal:false,
            messageModalMessage: "",
            messageModalHeader: "",
            messageModalColor: ""

        }
    }


    componentDidMount = () => {
        this.setState({ isLoaded: true });
        this.getUsers();

    }
    closeMessageModal = () => {
        this.setState({ messageModal: false });
    }
    closeAreYouSureModal = () => {
        this.setState({ areYouSureModal: false });
    }
closeSuccessModal=()=>{
    this.setState({successModal:false});
}
    clearMessages = () => {
        this.setState({
            userNameMessage: "",
            lastNameMessage: "",
            emailMessage: "",
            modalMessage: "",
        })
    }

    getUsers = () => {
        axios.get('http://localhost:3010/users/').then(res => {
            const users = res.data;
            this.setState({ users: users, isLoaded: true });
        }).catch(err => {
            this.setState({ error: err, isLoaded: true })
        });
    }


    handleModalNameChange = (e) => {
        let { value } = e.target;
        this.setState({ chosenUserName: value,userNameMessage:"" });
    }

    handleModalLastNameChange = (e) => {
        let { value } = e.target;
        this.setState({ chosenUserLastName: value ,lastNameMessage:""});
    }

    handleModalEmailChange = (e) => {
        let { value } = e.target;
        this.setState({ chosenUserEmail: value ,emailMessage:""});
    }

    toggleDeleteUserModal = (user) => {
        this.clearMessages();
        this.setState({
            areYouSureModal: true, chosenUserId: user.id,
            chosenUserName: user.first_name,
            chosenUserLastName: user.last_name,
            chosenUserEmail: user.email,
            oldUserName: user.first_name,
            oldUserLastName: user.last_name,
            oldUserEmail: user.email,
        });
    }
    toggleEditUserModal = (user) => {

        this.clearMessages();

        this.setState({
            modal: true,
            chosenUserId: user.id,
            chosenUserName: user.first_name,
            chosenUserLastName: user.last_name,
            chosenUserEmail: user.email,
            oldUserName: user.first_name,
            oldUserLastName: user.last_name,
            oldUserEmail: user.email,
        });

    }
    editUser = () => {

        this.clearMessages();

        const { chosenUserId, chosenUserName, chosenUserLastName, chosenUserEmail, oldUserName, oldUserLastName, oldUserEmail, modalErrorMessage } = this.state;
        var validated = true;
        if (chosenUserName === oldUserName && chosenUserEmail === oldUserEmail && chosenUserLastName === oldUserLastName) {
            this.setState({ modalMessage: "Değişiklik yapılmamıştır." });
            validated = false;
        }

        if (Validator.isEmpty(chosenUserName)) {
            this.setState({ userNameMessage: "Lütfen kullanıcının ismini giriniz." });
            validated = false;
        }

        if (Validator.isEmpty(chosenUserLastName)) {
            this.setState({ lastNameMessage: "Lütfen kullanıcının soyadını giriniz." });
            validated = false;
        }

        if (!Validator.isEmail(chosenUserEmail) || Validator.isEmpty(chosenUserEmail)) {
            this.setState({ emailMessage: "Lütfen mail adresi giriniz." })
            validated = false;
        }

        if (validated == true) {
            axios.put(`http://localhost:3010/users/updateuser`, {
                user_id: chosenUserId,
                first_name: chosenUserName,
                last_name: chosenUserLastName,
                email: chosenUserEmail
            })
                .then(res => {
                    this.getUsers();
                    
                    this.setState({ modal:false,modalMessage: "Kullanıcı başarıyla düzenlenmiştir.", oldUserName: chosenUserName,successModal:true });
                })
                .catch(err => {
                    this.setState({ modalMessage: "Problem yaşanmıştır." })
                });
        }

    }
    deleteUserbyId = (userId) => {
        this.setState({ alertMessage: "" });
        axios.delete('http://localhost:3010/users/deleteuser', {
            data: {
                user_id: userId
            }
        })
            .then(res => {
                this.getUsers();
                this.closeAreYouSureModal();
                this.setState({ messageModalMessage: "Kullanıcı başarıyla silinmiştir.", messageModalColor: "blue", messageModalHeader: "Mesaj", messageModal: true, alertColor: "primary" });
            })
            .catch(err => {
                this.setState({ error: err })
                this.closeAreYouSureModal();
                this.setState({ messageModalMessage: "Kullanıcı silinirken bir problem yaşanmıştır. Bu problem yüksek ihtimalle kullanıcının bir kursa veya  bir role atanmasından dolayı oluşmuştur.", messageModalColor: "red", messageModalHeader: "Hata Mesajı", messageModal: true, alertColor: "danger" })
            });

    }


    closeEditUserModal = () => {
        this.setState({
            modal: false,
            modalMessage: ""
        });

    }


    render() {

        const { alertMessage, alertColor, modalMessage, modalErrorMessage } = this.state;

        const someData = (

            this.state.users.map((user) => (
                {
                    name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    edit: <Button color="primary" onClick={() => this.toggleEditUserModal(user)}>Düzenle</Button>,
                    delete: <Button color="danger" onClick={() => this.toggleDeleteUserModal(user)}>Sil</Button>

                }
            ))

        );

        const data = {
            columns: [
                {
                    label: 'İsim',
                    field: 'name',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Soyisim',
                    field: 'last_name',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: '',
                    field: 'edit',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: '',
                    field: 'delete',
                    sort: 'asc',
                    width: 50
                },

            ],
            rows: someData
        };
        let alert;
        const marginTop = {
            marginTop: "10px"
        };



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
            <div>


                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Kullanıcıları Düzenle
                      </CardHeader>
                            <CardBody>


                                <MDBDataTable
                                    striped
                                    bordered
                                    large
                                    data={data}
                                />

                                {alert}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


                <Modal isOpen={this.state.modal}>
                    <ModalHeader>Kullanıcıyı Düzenle</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="firstName">İsim</Label>
                                <Input invalid={this.state.userNameMessage} type="text" name="firstName" id="firstName" value={this.state.chosenUserName} onChange={this.handleModalNameChange} />
                                <FormText color="danger">
                                    {this.state.userNameMessage}
                                </FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Soyisim</Label>
                                <Input invalid={this.state.lastNameMessage} type="text" name="lastName" id="lastName" value={this.state.chosenUserLastName} onChange={this.handleModalLastNameChange} />
                                <FormText color="danger">
                                    {this.state.lastNameMessage}
                                </FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input invalid={this.state.emailMessage} type="text" name="email" id="email" value={this.state.chosenUserEmail} onChange={this.handleModalEmailChange} />
                                <FormText color="danger">
                                    {this.state.emailMessage}
                                </FormText>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <p style={{ marginLeft: "20px" }}>{modalMessage}</p>
                    <ModalFooter>
                        <Button color="primary" onClick={this.editUser}>Düzenle</Button>
                        <Button color="Danger" onClick={this.closeEditUserModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style={{ backgroundColor: this.state.messageModalColor, color: "white" }} toggle={this.closeMessageModal}>{this.state.messageModalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.messageModalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.messageModalColor, color: "white" }} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.successModal} toggle={this.closeSuccessModal}>
                    <ModalHeader style={{ backgroundColor:"blue", color: "white" }} toggle={this.closeSuccessModal}>Mesaj</ModalHeader>
                    <ModalBody>
                        <p>Kullanıcı başarıyla düzenlenmiştir.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: "blue", color: "white" }} onClick={this.closeSuccessModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.areYouSureModal} toggle={this.closeAreYouSureModal}>
                    <ModalHeader  toggle={this.closeAreYouSureModal}>Kullanıcı Silme Onayı</ModalHeader>

                    <ModalBody>
                        <p> <strong>{this.state.chosenUserName} {this.state.chosenUserLastName} </strong>adlı kullanıcıyı silmek istediğinizden emin misiniz?</p>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.deleteUserbyId(this.state.chosenUserId)}>Sil</Button>
                        <Button color="primary" onClick={this.closeAreYouSureModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

            </div>



        );


    }

}


export default UserOperationComponent;