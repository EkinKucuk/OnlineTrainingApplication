import React, { Component } from 'react'
import {
    Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter,
    CardHeader, Card, CardBody, Row, Col
} from 'reactstrap';

import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
class ListSystemCoursesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            courses: [],
            isLoaded: false,
            chosenTab: 1,
            course: [],
            modalHeader: "",
            modalMessage: "",
            messageModal: false,
            messageModalColor: "",
            courseUsers: [],
            modalAddUser: false
        }
    }
    componentDidMount = () => {

        this.getCourses();
    }

    closeMessageModal = () => {
        this.setState({ messageModal: false });
    }

    sendEnrollRequest = (course) => {
        axios.post(`http://localhost:3010/course/enrollrequest`, {

            course_id: course.id,
        }).then(res => {
            this.setState({ modalMessage: course.course_name + " " + "adlı kursa katılma isteğiniz yollanmıştır.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true  });

        }).catch(err => {
            this.setState({ modalMessage: course.course_name + " " + "adlı kursta zaten bulunmaktasınız veya katılma isteğiniz bulunmaktadır.", modalHeader:"Hata Mesajı", messageModalColor:"red",messageModal:true })
        });
    }

    getCourses = () => {
        axios.get('http://localhost:3010/authcommon/getpubliccourses').then(res => {

            const courses = res.data;
            console.log(courses);
            this.setState({ courses: courses, isLoaded: true });
        }).catch(err => {
            this.setState({ error: err, isLoaded: true })
        });
    }


    render() {

        const { alertMessage, alertColor, course, modalMessage, modalErrorMessage } = this.state;
        let someData = [];
        if (this.state.courses.length > 0) {
            someData = (

                this.state.courses.map((course) => (
                    {
                        course_name: course.course_name,
                        course_desc: course.course_desc,
                        course_type: course.type_name,
                        module_opt: <Button color="primary" onClick={() => this.sendEnrollRequest(course)}>Kursa Katıl</Button>,
                    }
                ))

            );
        }


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
                    label: '',
                    field: 'module_opt',
                    sort: 'asc',
                    width: 50
                }


            ],
            rows: someData
        };


        let card = (
            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i> Açık Kursları İncele
                      </CardHeader>
                <CardBody>
                    <p>Bu sayfada sadece <strong>aktif</strong> ve <strong>açık</strong> olan kurslar listelenmektedir. </p>
                    <MDBDataTable
                        striped
                        bordered
                        large
                        data={data}
                    />

              
                </CardBody>
            </Card>
        );




        return (

            <div>

                <Row>
                    <Col>
                        {card}
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
export default ListSystemCoursesComponent;