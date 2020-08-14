import React, { Component } from 'react'
import {
    Button, Spinner, FormGroup, Input,
    Label, Form, Alert, Nav, NavItem, NavLink,
    CardHeader, Card, CardBody, Modal, ModalHeader, ModalFooter, ModalBody, FormText
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator'
import { MDBDataTable } from 'mdbreact';
import config from '../../config'
class RoleFormComponent extends Component {

    state = {
        error: null,
        isLoaded: false,
        course_types: [],
        alertMessage: "",
        alertColor: "primary",
        typeName: "",
        chosenTab: 1,
        modal2: false,
        modalMessage: "",
        courseTypeMessage: "",
        modalCourseTypeMessage: "",
        modalHeader:"",
        modalMessage:"",
        messageModal:false,
        messageModalColor:"",
        deleteModal: false,
        chosenCourseType: [],
    }


    toggleRoleEditModal = (courseType) => {
        console.log(courseType);
        this.setState({
            modal2: true,
            chosenTypeId: courseType.id,
            chosenTypeName: courseType.type_name,
            oldTypeName: courseType.type_name,
            modalMessage: ""
        });
    }

    closeRoleModal = () => {
        this.setState({
            modal2: false,
            modalMessage: "",
            modalCourseTypeMessage:""
        });
    }

    closeMessageModal=()=>{
        this.setState({messageModal:false});
    }

    getCourseTypes = () => {
        axios.get(`${config.dbPath}/course/getcoursetypes`)
            .then(res => {
                const course_types = res.data;
                this.setState({ course_types: course_types, isLoaded: true });
            })
            .catch(err => {
                this.setState({ error: err, isLoaded: true })
            });
    }
    //ViewDidload
    componentDidMount = () => {
        this.getCourseTypes();
    }

    handleChange = (e) => {
        this.setState({ typeName: e.target.value, courseTypeMessage: "" });
    }

    handleEditChange = (e) => {

        this.setState({ chosenTypeName: e.target.value, modalCourseTypeMessage: "" });
    }

    deleteCourseTypeModal = (course_type) => {

        this.setState({ chosenCourseType: course_type, deleteModal: true });
    }

    closeModal = () => {
        this.setState({ deleteModal: false})
    }

    deleteCourseType = () => {


        console.log(this.state.chosenCourseType);

        axios.delete('http://localhost:3010/course/deletecoursetype', {
            data: {
                type_id: this.state.chosenCourseType.id
            }
        })
            .then(res => {
                this.getCourseTypes();
                this.setState({ modalMessage:"Kurs tipi başarıyla silinmiştir.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true, deleteModal: false });
            })
            .catch(err => {
                this.setState({ modalMessage:"Kurs tipi silinirken bir problem yaşanmıştır. Bu sorun yüksek ihtimalle kurs tipinin bir kursa bağlı olmasından dolayı oluşmuştur.", modalHeader:"Hata Mesajı", messageModalColor:"red",messageModal:true, deleteModal: false })
                
            });
    }

    editCourseType = () => {

        const { chosenTypeName, chosenTypeId, oldTypeName } = this.state;
        if (chosenTypeName === oldTypeName) {
            console.log('This operation is not allowed.');
            this.setState({ modalMessage: "Kurs tipi ismi önceki isimle aynı." });
        }
        else {

            console.log(chosenTypeName);
            let validated = true;
            if (Validator.isEmpty(chosenTypeName) || chosenTypeName.length < 3) {
                validated = false;
                this.setState({ modalCourseTypeMessage: "Kurs tipi en az üç karakter olmalıdır." });
            }
            if (validated) {


                axios.put(`http://localhost:3010/course/updatecoursetype`, {
                    type_name: chosenTypeName,
                    id: chosenTypeId
                })
                    .then(res => {
                        this.getCourseTypes();
                        this.setState({ modalMessage:"Kurs tipi başarıyla güncellenmiştir.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true, modal2: false });
                    })
                    .catch(err => {
                        this.setState({ modalMessage: "Aynı isimde kurs tipi bulunmaktadır. Lütfen tekrar deneyiniz." })
                    });

            }





            // Send chosen role_name to the update, update the modal alert etc. Clear the forms etc.


        }

    }



    addCourseType = () => {

        const { typeName } = this.state;
        this.setState({ alertMessage: "", courseTypeMessage: "" });
        let validated = true;
        if (Validator.isEmpty(typeName) || typeName.length < 3) {
            validated = false;
            this.setState({ courseTypeMessage: "Kurs tipi en az üç karakterli olmalıdır." })
        }
        if (validated) {
            axios.post(`http://localhost:3010/course/addcoursetype`, {
                type_name: typeName
            })
                .then(res => {
                    this.getCourseTypes();
                    this.setState({ modalMessage:"Kurs tipi başarıyla eklenmiştir.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true, typeName: "", deleteModal: false });
                })
                .catch(err => {
                    this.setState({ modalMessage:"Aynı isimde kurs tipi sistemde bulunmaktadır..", modalHeader:"Hata Mesajı", messageModalColor:"red",messageModal:true, typeName: "", deleteModal: false })
                });
        }

    }

    render() {

        const { isLoaded, course_types, alertMessage, alertColor, chosenTab, typeName } = this.state;


        const someData = (

            course_types.map(course_type => (
                {
                    course_type: course_type.type_name,
                    edit: <Button color="primary" onClick={() => this.toggleRoleEditModal(course_type)}>Düzenle</Button>,
                    delete: <Button color="danger" onClick={() => this.deleteCourseTypeModal(course_type)}>Sil</Button>

                }
            ))

        );

        const data = {
            columns: [
                {
                    label: 'Kurs Tipi',
                    field: 'course_type',
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

            let card;
            if (chosenTab === 1) {
                card = (
                    <Card style={marginTop}>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i> Sistemde Bulunan Mevcut Roller
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
                )
            }
            else {
                card = (
                    <Card style={marginTop}>
                        <CardHeader >
                            <i className="fa fa-align-justify"></i> Kurs Tipi Ekleme
                            </CardHeader>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for="roleName">Kurs Tipi Ekleme</Label>
                                    <Input invalid={this.state.courseTypeMessage} type="text" name="roleName" id="roleName" placeholder="Kurs tipi ismini giriniz." value={this.state.typeName} onChange={this.handleChange} />
                                    <FormText>{this.state.courseTypeMessage}</FormText>
                                </FormGroup>
                                <Button color="primary" onClick={this.addCourseType}>Kurs Tipi Ekle</Button>
                            </Form>
                        </CardBody>
                        {alert}
                    </Card>
                )
            }
            return (
                <div>

                    <Nav tabs>
                        <NavItem>
                            <NavLink onClick={() => { this.setState({ chosenTab: 1, alertMessage: "" }) }}>
                                Kurs Tiplerini Listele
                                </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={() => { this.setState({ chosenTab: 2, alertMessage: "" }) }}>
                                Kurs Tipi Ekle
                                </NavLink>
                        </NavItem>
                    </Nav>

                    {card}


                    <Modal isOpen={this.state.modal2} toggle={this.closeRoleModal}>
                        <ModalHeader toggle={this.closeRoleModal}>Kurs Tipi Düzenleme</ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label for="roleName">Kurs Tipi İsmi</Label>
                                    <Input invalid={this.state.modalCourseTypeMessage} type="text" name="roleName" id="roleName" placeholder="Yeni ismi giriniz." value={this.state.chosenTypeName} onChange={this.handleEditChange} />
                                    <FormText>{this.state.modalCourseTypeMessage}</FormText>
                                </FormGroup>

                            </Form>
                            <p>{this.state.modalMessage}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.editCourseType}>Düzenle</Button>
                            <Button color="Danger" onClick={this.closeRoleModal}>Kapat</Button>
                        </ModalFooter>
                    </Modal>


                    <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style = {{backgroundColor: this.state.messageModalColor, color: "white"}} toggle={this.closeMessageModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style = {{backgroundColor: this.state.messageModalColor, color: "white"}} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.deleteModal} >
                    <ModalHeader>Kurs Tipi Sil</ModalHeader>
                    <ModalBody>
                        <strong>{this.state.chosenCourseType.type_name}</strong> adlı kurs tipini silmek istediğinizden emin misiniz?
                        </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteCourseType}>Sil</Button>
                        <Button color="primary" onClick={this.closeModal}>Geri Dön</Button>
                    </ModalFooter>
                </Modal>



                </div>
            );

        }


    }

}


export default RoleFormComponent;
