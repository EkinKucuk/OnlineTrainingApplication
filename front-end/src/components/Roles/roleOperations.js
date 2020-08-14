import React, { Component } from 'react'
import {
    Button, Spinner, FormGroup, Input, Container,
    Label, Form, Alert, Table, Nav, NavItem, NavLink, FormText,
    CardHeader, Card, CardBody, Modal, ModalHeader, ModalFooter, ModalBody, Row, Col
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator'
import { MDBDataTable } from 'mdbreact';

class RoleOperationsForm extends Component {

    state = {
        error: null,
        isLoaded: false,
        roles: [],
        alertMessage: "",
        alertColor: "primary",
        roleName: "",
        chosenTab: 1,
        users: [],
        modal: false,
        modal2: false,
        areYouSureModal: false,
        modalMessage: "",
        modalHeader:"",
        modalColor:"",
        errorModal: false,
        roleNameMessage: ""
    }
    componentDidMount = () => {
        this.getRoles();
    }
    handleEditChange = (e) => {
        let { value } = e.target;
        this.setState({ chosenRoleName: value, roleNameMessage: "" });
    }
    closeAreYouSureModal = () => {
        this.setState({ areYouSureModal: false });
    }

    getRoles = () => {
        axios.get('http://localhost:3010/roles')
            .then(res => {
                const roles = res.data;
                this.setState({ roles: roles, isLoaded: true });
            })
            .catch(err => {
                this.setState({ error: err, isLoaded: true })
            });
    }


    getUsersbyRole = (roleId) => {

        axios.get('http://localhost:3010/roles/getusersbyroleid', {
            params: {
                role_id: roleId
            }
        })
            .then(res => {
                const users = res.data;
                this.setState({ users: users });
                this.toggleUserList()
            })
            .catch(err => {
                this.setState({ error: err })
            });
    }
    toggleRoleDeleteModal=(role)=>{
        this.setState({
            areYouSureModal: true,
            roleNameMessage:"",
            chosenRoleId: role.id,
            chosenRoleName: role.role_name,
            oldRoleName: role.role_name,
            modalMessage: ""
        });
    }
    toggleRoleEditModal = (role) => {
        this.setState({
            modal2: true,
            roleNameMessage:"",
            chosenRoleId: role.id,
            chosenRoleName: role.role_name,
            oldRoleName: role.role_name,
            modalMessage: ""
        });
    }

    toggleUserList = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    closeErrorModal = () => {
        this.setState({ errorModal: false })
    }
    deleteRoleById = (roleId) => {

        this.setState({ alertMessage: "" });
        axios.delete('http://localhost:3010/roles/deleterole', {
            data: {
                role_id: roleId
            }
        })
            .then(res => {
                this.closeAreYouSureModal();
                this.getRoles();
                this.setState({ errorMessage: "Rol başarıyla silinmiştir.", modalHeader:"Mesaj",modalColor:"blue",errorModal:true,alertColor: "primary" });
            })
            .catch(err => {
                this.closeAreYouSureModal();
                this.setState({ error: err })
                this.setState({ errorMessage: "Rol kullanıcılara atandığından dolayı silinmemiştir!", modalHeader:"Hata Mesajı",modalColor:"red",errorModal: true })
            });
    }

    editRole = () => {

        const { chosenRoleName, chosenRoleId, oldRoleName } = this.state;

        if (chosenRoleName === oldRoleName) {
            console.log('This operation is not allowed.');
            this.setState({ modalMessage: "Rol ismi önceki isimle aynı." });
        }
        else {
            let validated = true;
            console.log(chosenRoleName);
            if (Validator.isEmpty(chosenRoleName) || chosenRoleName.length < 3) {
                validated = false;
                this.setState({ roleNameMessage: "Rol ismi en az 3 karakter olmalıdır." });
            }


            if (validated) {
                axios.put(`http://localhost:3010/roles/updaterole`, {
                    role_name: chosenRoleName,
                    role_id: chosenRoleId
                })
                    .then(res => {
                        this.getRoles();
                        this.setState({ errorMessage: "Rol başarıyla güncellenmiştir.", modalHeader:"Mesaj",modalColor:"blue", errorModal:true, modal2: false });
                    })
                    .catch(err => {
                        this.setState({ modalMessage: "Sistemde aynı isimde rol bulunmaktadır. Lütfen başka isim seçiniz." })
                    });
            }


            // Send chosen role_name to the update, update the modal alert etc. Clear the forms etc.

        }

    }
    closeRoleModal = () => {
        this.setState({
            modal2: false,
            modalMessage: ""
        });
    }


    render() {
        const { isLoaded, error, roles, users } = this.state;

        const marginTop = {
            marginTop: "10px"
        };
        

        const someData = (

            roles.map((role) => (
                {
                    name: role.role_name,
                    users: <Button color="primary" onClick={this.getUsersbyRole.bind(this, role.id)}>Kullanıcıları Listele</Button>,
                    edit:  <Button color="primary" onClick={this.toggleRoleEditModal.bind(this, role)}>Düzenle</Button>,
                    delete: <Button color="danger" onClick={this.toggleRoleDeleteModal.bind(this, role)}>Sil</Button>

                }
            ))

        );

        const data = {
            columns: [
                {
                    label: 'Rol İsmi',
                    field: 'name',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Atanmış Kullanıcıları Listele',
                    field: 'users',
                    width: 200
                },
                {
                    label: 'Düzenle',
                    field: 'edit',
                    width: 200
                },
                {
                    label: '',
                    field: 'delete',
                    width: 50
                },
    

            ],
            rows: someData
        };

        let usersList;
        if (users.length === 0) {
            usersList = (
                <p>Kullanıcı atanmamıştır.</p>
            );
        }
        return (
            <div>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>

                                <i className="fa fa-align-justify"></i>Sistemde Bulunan Mevcut Roller
                            </CardHeader>
                            <CardBody>
                              
                            <MDBDataTable
                                    striped
                                    bordered
                                    large
                                    data={data}
                                />
                             
                            </CardBody>

                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggleUserList}>
                    <ModalHeader toggle={this.toggleUserList}>Kullanıcı Listesi</ModalHeader>
                    <ModalBody>
                        {usersList}
                        {users.map(user => (
                            <p key={user.id} value={user.id}>{user.first_name} {user.last_name}</p>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="Danger" onClick={this.toggleUserList}>Kapat</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modal2} toggle={this.closeRoleModal}>
                    <ModalHeader toggle={this.closeRoleModal}>Rol Düzenleme</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="roleName">Rol İsmi</Label>
                                <Input invalid={this.state.roleNameMessage} type="text" name="roleName" id="roleName" placeholder="Yeni ismi giriniz." value={this.state.chosenRoleName} onChange={this.handleEditChange} />
                                <FormText>
                                    {this.state.roleNameMessage}
                                </FormText>
                            </FormGroup>

                        </Form>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.editRole}>Düzenle</Button>
                        <Button color="danger" onClick={this.closeRoleModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.errorModal} toggle={this.closeErrorModal}>
                    <ModalHeader style={{ backgroundColor: this.state.modalColor, color: "white" }} toggle={this.closeErrorModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.errorMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.modalColor, color: "white" }} onClick={this.closeErrorModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.areYouSureModal} toggle={this.closeAreYouSureModal}>
                    <ModalHeader  toggle={this.closeAreYouSureModal}>Rol Silme Onayı</ModalHeader>

                    <ModalBody>
                        <p> <strong>{this.state.chosenRoleName} </strong> rolünü silmek istediğinizden emin misiniz?</p>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.deleteRoleById(this.state.chosenRoleId)}>Sil</Button>
                        <Button color="primary" onClick={this.closeAreYouSureModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>



            </div>

        );
    }


}

export default RoleOperationsForm;