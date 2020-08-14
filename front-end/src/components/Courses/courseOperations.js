import React, { Component } from 'react'
import {
    Button, FormGroup, Input,
    Label, Form, Alert, Table,
    CardHeader, Card, CardBody, Modal, ModalHeader, ModalFooter, ModalBody, Row, Col, FormText
} from 'reactstrap';

import axios from 'axios';
import config from '../../config'
import { MDBDataTable } from 'mdbreact';
import { AppSwitch } from '@coreui/react'
import ModuleManagement from '../Modules/moduleManagement'
import CourseReview from '../Courses/courseReview'
import AssignCourseToUser from '../Courses/assignCourseToUser'
import Validator from 'validator'

class CourseOperationsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            courses: [],
            isLoaded: false,
            alertMessage: "",
            alertColor: "primary",
            chosenTab: 1,
            course: [],
            users: [],
            chosenUser: null,
            chosenRole: null,
            modalCourseNameMessage: "",
            modalCourseDescMessage: "",
            modalCourseObjectiveMessage: "",
            modalHeader: "",
            modalMessage: "",
            messageModal: false,
            messageModalColor: "",
            areYouSureModal: false,
            successModal: false,
            modalErrorMessage: {
                message1: "",
                message2: "",
                message3: ""
            },
            courseUsers: [],
        }
    }
    componentDidMount = () => {

        this.setState({ isLoaded: true });
        this.getCourses();
    }
    closeAreYouSureModal = () => {
        this.setState({ areYouSureModal: false });
    }
    closeSuccessModal = () => {
        this.setState({ successModal: false });
    }
    clearMessages = () => {
        this.setState({
            modalCourseNameMessage: "",
            modalCourseDescMessage: "",
            modalCourseObjectiveMessage: "",
            alertMessage: ""
        })
    }

    getCourses = () => {
        axios.get('http://localhost:3010/course/').then(res => {
            const courses = res.data;
            this.setState({ courses: courses, isLoaded: true });
        }).catch(err => {
            this.setState({ error: err, isLoaded: true })
        });
    }
    deleteCoursebyId = (courseId) => {

        this.setState({ alertMessage: "" });
        axios.delete('http://localhost:3010/course/deletecourse', {
            data: {
                course_id: courseId
            }
        })
            .then(res => {
                this.closeAreYouSureModal();
                this.setState({ modalMessage: "Kurs başarıyla silinmiştir.", modalHeader: "Mesaj", messageModalColor: "blue", messageModal: true, alertColor: "primary" });
                this.getCourses();
            })
            .catch(err => {
                this.closeAreYouSureModal();
                this.setState({ error: err })
                this.setState({ modalMessage: "Kursa kayıtlı kullanıcılar olduğu için kurs silinememiştir.", modalHeader: "Hata Mesajı", messageModalColor: "red", messageModal: true, alertColor: "danger" })
            });
    }

    handleModalCourseNameChange = (e) => {
        let { value } = e.target;
        this.setState({ chosenCourseName: value, modalCourseNameMessage: "" });
    }
    handleCourseStatusChanged = (e) => {
        this.setState({ choosenCourseStatus: !this.state.choosenCourseStatus });
    }
    handleExamStatusChanged = (e) => {
       console.log(this.state.chosenExamStatus);
        this.setState({ chosenExamStatus: !this.state.chosenExamStatus });
    }
    handleCoursePrivacyChanged = (e) => {
        this.setState({ choosenCoursePrivacy: !this.state.choosenCoursePrivacy });
    }
    handleModalCourseGoalChange = (e) => {
        let { value } = e.target;
        this.setState({ chosenCourseGoal: value, modalCourseObjectiveMessage: "" });
    }

    handleModalCourseDescChange = (e) => {
        let { value } = e.target;
        this.setState({ chosenCourseDesc: value, modalCourseDescMessage: "" });
    }

    toggleDeleteCourseModal = (course) => {
        this.setState({
            areYouSureModal: true,
            chosenCourseId: course.id,
            chosenCourseName: course.course_name,
            chosenCourseDesc: course.course_desc,
            chosenCourseGoal: course.course_goals,
            oldCourseName: course.course_name,
            oldCourseDesc: course.course_desc,
            oldCourseGoal: course.course_goals,
            oldCourseStatus: course.course_status,
            oldCoursePrivacy: course.course_isprivate,
            choosenCourseStatus: course.course_status,
            choosenCoursePrivacy: course.course_isprivate,
            modalMessage: "",
        });
    }

    toggleEditCourseModal = (course) => {

        console.log(course);
        this.setState({
            modal: true,
            chosenCourseId: course.id,
            chosenCourseName: course.course_name,
            chosenCourseDesc: course.course_desc,
            chosenCourseGoal: course.course_goals,
            oldCourseName: course.course_name,
            oldCourseDesc: course.course_desc,
            oldCourseGoal: course.course_goals,
            oldCourseStatus: course.course_status,
            oldCoursePrivacy: course.course_isprivate,
            choosenCourseStatus: course.course_status,
            chosenExamStatus:course.course_hasexam,
            choosenCoursePrivacy: course.course_isprivate,
            oldhasExam:course.course_hasexam,
            modalMessage: "",
        });

    }

    editCourse = () => {

        const { chosenCourseId, chosenCourseName, chosenCourseGoal, oldCourseName, oldCourseDesc, oldCourseGoal,
            chosenCourseDesc, oldCoursePrivacy, choosenCoursePrivacy, oldhasExam,chosenExamStatus,choosenCourseStatus, oldCourseStatus } = this.state;

        console.log(this.state);
        if (chosenCourseName === oldCourseName && chosenCourseDesc === oldCourseDesc
            && chosenCourseGoal === oldCourseGoal && oldCoursePrivacy === choosenCoursePrivacy && choosenCourseStatus === oldCourseStatus && oldhasExam===chosenExamStatus) {
            this.setState({ modalMessage: "Değişiklik yapılmamıştır." });
        }

        else {
            let validated = true;
            if (Validator.isEmpty(chosenCourseName) || chosenCourseName.length < 3) {
                validated = false;
                this.setState({ modalCourseNameMessage: "Kurs adı en az 3 karakter olmalıdır." });
            }
            if (Validator.isEmpty(chosenCourseDesc) || chosenCourseDesc.length < 3) {
                validated = false;
                this.setState({ modalCourseDescMessage: "Kurs açıklaması en az 3 karakter olmalıdır." });
            }
            if (Validator.isEmpty(chosenCourseGoal) || chosenCourseGoal.length < 6) {
                validated = false;
                this.setState({ modalCourseObjectiveMessage: "Kursun hedefleri en az 6 karakter olmalıdır." });
            }
            if (validated) {
                this.clearMessages();
                axios.put(`http://localhost:3010/course/updatecourse`, {
                    course_id: chosenCourseId,
                    course_name: chosenCourseName,
                    course_desc: chosenCourseDesc,
                    course_goals: chosenCourseGoal,
                    course_isprivate: choosenCoursePrivacy,
                    course_status: choosenCourseStatus,
                    course_hasexam:chosenExamStatus
                })
                    .then(res => {
                        this.getCourses();
                        this.setState({ modal: false, modalMessage: "Kurs başarıyla düzenlenmiştir.", chosenOldCourseName: chosenCourseName, successModal: true });
                    })
                    .catch(err => {
                        this.setState({ modalMessage: "Aynı isimde kurs bulunmaktadır." })
                    });

            }

        }

    }
    closeMessageModal = () => {
        this.setState({ messageModal: false });
    }

    closeEditCourseModal = () => {
        this.clearMessages();
        this.setState({
            modal: false,
            modalMessage: ""
        });

    }




    togglePage = (number, course) => {
        if (number === 3) {
            this.setState({ chosenTab: number, course: course })
        }
        else {
            this.setState({ course: course, chosenTab: number })
        }
    }

    render() {

        const { alertMessage, alertColor, course, modalMessage, modalErrorMessage } = this.state;
        const someData = (

            this.state.courses.map((course) => (
                {
                    course_name: course.course_name,
                    course_desc: course.course_desc,
                    course_type: course.type_name,
                    review: <Button color="primary" onClick={() => this.togglePage(4, course)}>Yorumları İncele</Button>,
                    module_opt: <Button color="primary" onClick={() => this.togglePage(2, course)}>Modulleri Yönet</Button>,
                    add_usr: <Button color="primary" onClick={() => this.togglePage(3, course)}>Kullanıcı Ekle</Button>,
                    edit: <Button color="primary" onClick={() => this.toggleEditCourseModal(course)}>Düzenle</Button>,
                    del: <Button color="danger" onClick={() => this.toggleDeleteCourseModal(course)}>Sil</Button>
                }
            ))

        );

        const data = {
            columns: [
                {
                    label: 'Kurs Adı',
                    field: 'course_name',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Kurs Açıklaması',
                    field: 'course_desc',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Kurs Tipi',
                    field: 'course_type',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Yorumları İncele',
                    field: 'review',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Modulleri Yönet',
                    field: 'module_opt',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Kullanıcı Ekle/Çıkar',
                    field: 'add_usr',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: '',
                    field: 'edit',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: '',
                    field: 'del',
                    sort: 'asc',
                    width: 50
                },

            ],
            rows: someData
        };






        const alertTop = {
            marginTop: "10px"
        };



        let alert;
        if (alertMessage !== "") {
            alert = (
                <div style={alertTop}>
                    <Alert color={alertColor}>
                        {alertMessage}
                    </Alert>
                </div>
            )
        }

        let card = (
            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i> Kursları Düzenle
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
        );

        if (this.state.chosenTab === 2) {
            card = (
                <div>
                    <ModuleManagement course_id={this.state.course.id} course_name={this.state.course.course_name} />
                </div>
                

            )
        }

        if (this.state.chosenTab === 3) {
            card = (

                <AssignCourseToUser course={this.state.course} />
            )
        }

        if (this.state.chosenTab == 4) {
            card = (
                <CourseReview course_id={this.state.course.id} />
            );
        }





        return (
            <div>



                <Row>
                    <Col>
                        {card}
                    </Col>
                </Row>

                <Modal isOpen={this.state.modal}>
                    <ModalHeader>Kursu Düzenle</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="courseName">Kurs Adı</Label>
                                <Input invalid={this.state.modalCourseNameMessage} type="text" name="CourseName" id="CourseName" value={this.state.chosenCourseName} onChange={this.handleModalCourseNameChange} />
                                <FormText color="danger">
                                    {this.state.modalCourseNameMessage}
                                </FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="courseDesc">Kurs Açıklaması</Label>
                                <Input invalid={this.state.modalCourseDescMessage} type="text" name="courseDesc" id="courseDesc" value={this.state.chosenCourseDesc} onChange={this.handleModalCourseDescChange} />
                                <FormText color="danger">
                                    {this.state.modalCourseDescMessage}
                                </FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="courseDesc">Kurs Hedefleri</Label>
                                <Input invalid={this.state.modalCourseObjectiveMessage} type="courseDesc" name="courseDesc" id="courseDesc" value={this.state.chosenCourseGoal} onChange={this.handleModalCourseGoalChange} />
                                <FormText color="danger">
                                    {this.state.modalCourseObjectiveMessage}
                                </FormText>
                            </FormGroup>
                            <div>
                                <label>
                                    <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={this.handleCourseStatusChanged} checked={this.state.choosenCourseStatus} />{' '}
                                    <span>Aktif Kurs</span>
                                </label>

                                <label>
                                    <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={this.handleCoursePrivacyChanged} checked={this.state.choosenCoursePrivacy} />{' '}
                                    <span>Kapalı Kurs</span>
                                </label>
                                <label>
                                    <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={this.handleExamStatusChanged} checked={this.state.chosenExamStatus} />{' '}
                                    <span>Kursun Sınavı Var</span>
                                </label>
                            </div>
                        </Form>
                    </ModalBody>
                    <p style={{ marginLeft: "20px" }}>{this.state.modalMessage}</p>
                    <ModalFooter>
                        <Button color="primary" onClick={this.editCourse}>Düzenle</Button>
                        <Button color="Danger" onClick={this.closeEditCourseModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.successModal} toggle={this.closeSuccessModal}>
                    <ModalHeader style={{ backgroundColor: "blue", color: "white" }} toggle={this.closeSuccessModal}>Mesaj</ModalHeader>
                    <ModalBody>
                        <p>Kurs başarıyla düzenlenmiştir.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: "blue", color: "white" }} onClick={this.closeSuccessModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style={{ backgroundColor: this.state.messageModalColor, color: "white" }} toggle={this.closeMessageModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.messageModalColor, color: "white" }} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.areYouSureModal} toggle={this.closeAreYouSureModal}>
                    <ModalHeader toggle={this.closeAreYouSureModal}>Kurs Silme Onayı</ModalHeader>

                    <ModalBody>
                        <p> <strong>{this.state.chosenCourseName}</strong> isimli kursu silmek istediğinizden emin misiniz?</p>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.deleteCoursebyId(this.state.chosenCourseId)}>Sil</Button>
                        <Button color="primary" onClick={this.closeAreYouSureModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>



            </div>




        );
    }
}
export default CourseOperationsComponent;