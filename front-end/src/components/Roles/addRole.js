import React, { Component } from 'react'
import {
    Button, Spinner, FormGroup, Input, Container,
    Label, Form, Alert, Table, Nav, NavItem, NavLink, FormText,
    CardHeader, Card, CardBody, Modal, ModalHeader, ModalFooter, ModalBody,Row,Col
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator';
class RoleFormComponent extends Component {

    state = {
        error: null,
        isLoaded: false,
        alertMessage: "",
        alertColor: "primary",
        roleName: "",
        modalMessage: "",
        roleNameMessage: "",
        messageModal: false,
        modalHeader: "",
        modalMessage: ""
    }



    //ViewDidload
    componentDidMount = () => {
        this.setState({isLoaded: true})
    }

    handleChange = (e) => {
        this.setState({ roleName: e.target.value, roleNameMessage: "" });
    }
    
    closeMessageModal = () => {
        this.setState({ messageModal: false});
    }

    addRole = () => {

        const { roleName } = this.state;

        let validated = true;
        
        if (roleName.length < 3){
            this.setState({roleNameMessage: "Rol ismi en az 3 karakter olmalıdır."});
            validated = false;
        }
        
        if(validated == true){
            axios.post(`http://localhost:3010/roles/addrole`, {
            role_name: roleName
            })
            .then(res => {
                this.setState({ modalBackgroundColor: "blue", messageModal: true, modalHeader: "Mesaj", modalMessage: "Rol başarıyla eklenmiştir.", roleName: "", roleNameMessage: ""  });
            })
            .catch(err => {
                this.setState({ modalBackgroundColor: "red", messageModal: true, modalHeader: "Hata Mesajı", modalMessage: "Aynı rol isminde rol bulunmaktadır.", roleName: "", roleNameMessage: ""  });
            });
        }

        
    }

    render() {

        const { isLoaded, error, roles, alertMessage, alertColor, chosenTab, users } = this.state;

        const marginTop = {
            marginTop: "10px"
        };

        const cardHeader = {
            backgroundColor: "#006CFB",
            color: "white"
        }


        if (isLoaded === false) {
            return (<div>

                <Spinner color="primary" />
            </div>
            )
        }
        else {

            return (
                <div>
                    
                    <Row>
                        <Col>
                        <Card style={marginTop}>
                        <CardHeader>
                        <i className="fa fa-align-justify"></i>Kullanıcı Rolü Yaratma.
                            </CardHeader>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for="roleName">Rol İsmi:</Label>
                                    <Input invalid = {this.state.roleNameMessage} type="text" name="roleName" id="roleName" placeholder="Rol ismini giriniz." value={this.state.roleName} onChange={this.handleChange} />
                                    <FormText>{this.state.roleNameMessage}</FormText>
                                </FormGroup>
                                <Button color="primary" onClick={this.addRole}>Rol Yarat</Button>
                            </Form>
                        </CardBody>

                    </Card>
                        </Col>
                    </Row>

                    <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style = {{backgroundColor: this.state.modalBackgroundColor, color: "white"}} toggle={this.closeMessageModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style = {{backgroundColor: this.state.modalBackgroundColor, color: "white"}} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>
                    
                </div>
            );

        }


    }

}


export default RoleFormComponent;