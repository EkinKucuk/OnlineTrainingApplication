import React, { Component } from 'react'
import {
    Button, Alert, ModalBody,
    CardHeader, Card, CardBody, Modal, ModalHeader, Row, ModalFooter, CardFooter
} from 'reactstrap';
import axios from 'axios';
import PDFDisplayer from '../Modules/pdfDisplayer';
import VideoDisplayerComponent from '../Modules/videoDisplayer';
import ReviewModal from '../Modules/reviewModal';
import QuestionModal from '../Modules/questionModal'
import EditReviewModal from '../Modules/editReviewModal';
import Quiz from '../Exam/quiz'
class CourseModuleComponent extends Component {


    constructor(props) {
        super(props);

        this.state = {

            error: null,
            alertMessage: "",
            alertColor: "",
            progress: "",
            isLoaded: false,
            courseName: "",
            courseModules: [],
            filePath: "",
            modalIsOpen: false,
            reviewModal: false,
            selectedModule: [],
            userReview: null,
            editReviewModal: false,
            questionModal: false,
            modalHeader: "",
            modalMessage: "",
            messageModal: false,
            messageModalColor: "",
            exams: [],
            selectedExam: [],


        }
    }

    getCourseModules = () => {


        axios.get('http://localhost:3010/authcommon/getmodules', {
            params: {
                course_id: this.props.course_id
            }
        }).then(res => {
            const courseModules = res.data.rows;
            this.setState({ courseModules: courseModules, isLoaded: true });
        })
            .catch(err => {
                this.setState({ error: err, isLoaded: true })
            });


    }

    getExams = () => {

        axios.get('http://localhost:3010/exam/getexams', {
            params: {
                course_id: this.props.course_id
            }
        }).then(res => {
            const exams = res.data.rows;
            this.setState({ exams: exams, isLoaded: true });
        })
            .catch(err => {
                this.setState({ error: err, isLoaded: true })
            });


    }

    getUserReview = () => {
        axios.get('http://localhost:3010/review/getuserreview', {
            params: {
                course_id: this.props.course_id
            }
        }).then(res => {

            console.log(res.data);
            if (res.data.length > 0) {
                const review = res.data[0];
                this.setState({ userReview: review, isLoaded: true });
            }
            else {
                this.setState({ isLoaded: true, userReview: null });
            }


        })
            .catch(err => {
                this.setState({ error: err, isLoaded: true })
            });
    }

    componentDidMount = () => {
        this.getCourseModules();
        this.getUserReview();
        this.getExams();
    }

    getFile = (selectedModule) => {
        console.log(selectedModule);
        this.setState({ selectedModule: selectedModule, modalIsOpen: true });
    }
    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }

    goToExam = (exam) => {
        this.setState({ examPage: true, selectedExam: exam})
    }

    closeMessageModal=()=>{
        this.setState({messageModal:false});
    }

    editReviewCourse = () => {
        this.setState({ editReviewModal: true })
    }

    closeEditReviewModal = (modalMessage, modalHeader, messageModalColor) => {

        if(modalMessage !== ""){
            this.getUserReview();
            this.setState({ editReviewModal: false, modalMessage: modalMessage, modalHeader: modalHeader, messageModalColor: messageModalColor, messageModal: true });
        }
        else {
            this.setState({ editReviewModal: false });
        }
    }

    questionModal = () => {
        this.setState({ questionModal: true });
    }

    closeExamModal = () => {
        this.setState({ examPage: false})
    }

    closeQuestionModal = () => {
        this.setState({ questionModal: false });
    }

    reviewCourse = () => {

        this.setState({ reviewModal: true })
    }

    closeReviewModal = (modalMessage, modalHeader, messageModalColor) => {
        if(modalMessage !== ""){
            this.getUserReview();
            this.setState({ reviewModal: false, modalMessage: modalMessage, modalHeader: modalHeader, messageModalColor: messageModalColor, messageModal: true });
        }
        else {
            this.setState({ reviewModal: false });
        }
      
    }

    render() {

        const { alertMessage, alertColor } = this.state;
        const style = {
            width: "750px",
        }
        const alertStyle = {
            marginTop: "10px"
        };

        let alert;
        if (alertMessage !== "") {
            alert = (<div style={alertStyle}>
                <Alert color={alertColor}>
                    {alertMessage}
                </Alert>
            </div>)
        }

        let card = (
            <p>Nothing is loaded.</p>
        )

        if (this.state.selectedModule.module_typeid == 2 && this.state.modalIsOpen === true) {
            // pdf
            card = (<PDFDisplayer module_path={this.state.selectedModule.module_path} is_downloadable={this.state.selectedModule.is_downloadable} />)

        }
        else if (this.state.selectedModule.module_typeid == 1 && this.state.modalIsOpen === true) {
            // video
            card = (<VideoDisplayerComponent module_path={this.state.selectedModule.module_path} is_downloadable={this.state.selectedModule.is_downloadable} />)
        }

        let mainLayout = (
            <p>Bu kursa modül eklenmemiştir.</p>
        )

        if (this.state.courseModules.length > 0) {
            mainLayout = (
                <div>
                    <h3>Kurs İçeriği</h3>
                    <hr></hr>

                    {this.state.courseModules.map((courseModule, index) => (
                        <div>
                            <Card key={index} style={{ marginTop: "20px" }} className="mb-0">
                                <CardHeader className="text-white bg-info">

                                    <h5 className="m-0 p-0">{courseModule.module_name}</h5>

                                </CardHeader>
                                <CardBody>
                                    <p>Modül Açıklaması:</p>
                                    <hr></hr>
                                    <p>{courseModule.module_desc}</p>

                                </CardBody>
                                <CardFooter>
                                    <Button className="text-white" color="info" onClick={() => this.getFile(courseModule)}>Modülü Aç</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}

                    
                </div>
            )
        }

        let examLayout;

        if(this.state.exams.length > 0){
            examLayout = (
                <div>
                {this.state.exams.map((exam, index) => (
                    <div>
                        <Card key={index} style={{ marginTop: "20px" }} className="mb-0">
                            <CardHeader className="text-white bg-warning">

                                <h5 className="m-0 p-0">{exam.exam_name}</h5>

                            </CardHeader>
                            <CardBody>
                                <p>Sınav Açıklaması:</p>
                                <hr></hr>
                                <p>{exam.exam_description}</p>

                            </CardBody>
                            <CardFooter>
                                <Button className="text-white" color="warning" onClick = {() => this.goToExam(exam)}>Sınava Git</Button>
                            </CardFooter>
                        </Card>
                    </div>
                ))}
                </div>
            )
        }

        let reviewText;

        if (this.state.userReview !== null) {
            reviewText = (
                <a onClick={() => this.editReviewCourse()} className="pull-right">Yorumunuzu incelemek için tıklayınız.</a>
            )
        }
        else {
            reviewText = (
                <a onClick={() => this.reviewCourse()} className="pull-right">Kursu yorumlamak için tıklayınız.</a>
            )
        }

        return (
            <div className="animated fadeIn">
                <Row >
                    <Card className="mx-auto ">
                        <CardHeader style={style}>
                            {this.props.course_name} {reviewText}
                        </CardHeader>
                        <CardBody>

                            {mainLayout}
                            {examLayout}


                        </CardBody>

                        <CardFooter>
                            
                        </CardFooter>
                    </Card>
                </Row>
                <Modal isOpen={this.state.modalIsOpen} size="lg">
                    <ModalHeader>
                        {this.state.selectedModule.module_name}

                    </ModalHeader>


                    {card}


                    <ModalFooter>
                        <Button color="danger" onClick={this.closeModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.reviewModal} size="lg">
                    <ModalHeader>
                        {this.props.course_name} Değerlendirmesi
                    </ModalHeader>

                    <ReviewModal course_id={this.props.course_id} closeReviewModal={this.closeReviewModal} />
                </Modal>

                <Modal isOpen={this.state.editReviewModal} size="lg">
                    <ModalHeader>
                        {this.props.course_name} Değerlendirmeniz
                    </ModalHeader>

                    <EditReviewModal course_id={this.props.course_id} closeEditReviewModal={this.closeEditReviewModal} userReview={this.state.userReview} />
                </Modal>

                <Modal isOpen={this.state.questionModal} size="lg">
                    <ModalHeader>
                        {this.props.course_name} Soru Formu
                    </ModalHeader>

                    <QuestionModal course_id={this.props.course_id} closeQuestionModal={this.closeQuestionModal} />
                </Modal>

                <Modal isOpen={this.state.examPage} size="lg">
                    <ModalHeader>
                        {this.state.selectedExam.exam_name}
                    </ModalHeader>

                    <Quiz exam={this.state.selectedExam} closeExamModal = {this.closeExamModal}/>
                    
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
            </div>


        );
    }







}
export default CourseModuleComponent;