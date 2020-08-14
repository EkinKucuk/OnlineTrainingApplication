import React, { Component } from 'react'
import {
    Button, Alert, Form, FormGroup, Label, Input, FormText,
    CardHeader, Card, CardBody, Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import axios from 'axios';
import CreateQuestion from '../Exam/createQuestion'
import { MDBDataTable } from 'mdbreact';
class ExamOperations extends Component {


    constructor(props) {
        super(props);

        this.state = {

            error: null,
            isLoaded: false,
            exams: [],
            selectedExam: [],
            modal: false,
            alertMessage: "",
            updateExamModal: false,
            oldExamName: "",
            oldExamDesc: "",
            toggleQuestionPage: false

        }
    }

    closeMessageModal=()=>{
        this.setState({messageModal:false});
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

    deleteExam = (exam_id) => {
        this.clearMessages();
        axios.delete('http://localhost:3010/exam/deleteexam', {
            data: {
                exam_id: exam_id,
                course_id: this.props.course_id
            }
        })
            .then(res => {
                this.getExams();
                this.setState({ modalMessage:"Sınav başarıyla silinmiştir.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true, modal: false });
            })
            .catch(err => {
                this.setState({ error: err })
                this.setState({ modalMessage:"Sınav silinirken problem yaşanmıştır.", modalHeader:"Hata Mesajı", messageModalColor:"red",messageModal:true, modal: false  })
            });
    }

    componentDidMount = () => {
        this.getExams();
    }

    clearMessages = () => {
        this.setState({
            updateModalMessage: "",
            examNameMessage: "",
            examDescMessage: "",
            alertMessage: "",
            alertColor: ""
        })
    }

    toggleExamDeleteModal = (exam) => {
        this.setState({ selectedExam: exam, modal: true })
    }
    toggleUpdateModal = (exam) => {
        this.clearMessages();
        console.log(exam);
        const { exam_name, exam_description } = exam;
        this.setState({ selectedExam: exam, updateExamModal: true, oldExamName: exam_name, oldExamDesc: exam_description })
    }

    toggleAddQuestionPage = (exam) => {
        this.setState({ selectedExam: exam, toggleQuestionPage: true })
    }

    closeModal = () => {
        this.setState({ modal: false });
    }
    closeUpdateModal = () => {
        this.setState({ updateExamModal: false })
    }

    handleExamNameChanged = (e) => {
        let { value } = e.target;
        this.setState({
            selectedExam: Object.assign({}, this.state.selectedExam, {
                exam_name: value,
            }),
        });
    }
    handleExamDescChanged = (e) => {
        let { value } = e.target;
        this.setState({
            selectedExam: Object.assign({}, this.state.selectedExam, {
                exam_description: value,
            }),
        });
    }

    updateExam = () => {

        const { oldExamName, oldExamDesc, selectedExam } = this.state;
        let validated = 1;

        if (oldExamName === selectedExam.exam_name && oldExamDesc === selectedExam.exam_description) {
            validated = 0;
            this.setState({ updateModalMessage: "Hiç bir değişiklik yapılmamıştır." })
        }

        if (selectedExam.exam_name.length < 3) {
            validated = 0;
            this.setState({ examNameMessage: "Sınav ismi en az 3 karakter olmalıdır." })
        }

        if (selectedExam.exam_description.length < 3) {
            validated = 0;
            this.setState({ examDescMessage: "Sınav açıklaması en az 3 karakter olmalıdır." })
        }


        if (validated == 1) {

            axios.put(`http://localhost:3010/exam/updateexam`, {
                exam_id: selectedExam.id,
                course_id: this.props.course_id,
                exam_name: selectedExam.exam_name,
                exam_description: selectedExam.exam_description,
               
            })
                .then(res => {
                    this.getExams();
                    this.setState({ updateExamModal: false, modalMessage:"Sınav başarıyla güncellenmiştir.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true });
                })
                .catch(err => {
                    this.setState({ updateModalMessage: "Problem yaşanmıştır. Lütfen tekrardan deneyiniz." })
                });

        }


    }




    render() {

        const { alertMessage, alertColor } = this.state;

        let mainLayout = (
            <p>Bu kursa sınav eklenmemiştir.</p>
        )

        const marginTop = {
            marginTop: "10px"
        };

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

        if (this.state.exams.length > 0 && this.state.toggleQuestionPage == false) {


            const exams = (

                this.state.exams.map((exam) => (
                    {
                        exam_name: exam.exam_name,
                        exam_desc: exam.exam_description,
                        edit: <Button color="primary" onClick={() => this.toggleUpdateModal(exam)}>Düzenle</Button>,
                        edit_file: <Button color="primary" onClick={() => this.toggleAddQuestionPage(exam)}>İçeriği Düzenle</Button>,
                        delete: <Button color="danger" onClick={() => this.toggleExamDeleteModal(exam)}>Sil</Button>
                    }
                ))
            )

            const examsTable = {
                columns: [
                    {
                        label: 'Sınav İsmi',
                        field: 'exam_name',
                        sort: 'asc',
                        width: 200
                    },
                    {
                        label: 'Sınav Açıklaması',
                        field: 'exam_desc',
                        sort: 'asc',
                        width: 200
                    },
                    {
                        label: '',
                        field: 'edit',
                        width: 200
                    },
                    {
                        label: '',
                        field: 'edit_file',
                        width: 50
                    },
                    {
                        label: '',
                        field: 'delete',
                        width: 50
                    },

                ],
                rows: exams
            };

            mainLayout = (

                
                <MDBDataTable
                striped
                bordered
                large
                data={examsTable}
            />



            )

            
        }
        if(this.state.toggleQuestionPage === true){
            mainLayout = (
                <CreateQuestion exam = {this.state.selectedExam}/>
            )
        }


        return (
            <div className="animated fadeIn">


                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> {this.props.course_name} Sınav İçeriği
                        </CardHeader>
                    <CardBody>

                        {mainLayout}

                        {alert}
                    </CardBody>
                </Card>

                <Modal isOpen={this.state.modal} >
                    <ModalHeader>Sınavı Sil</ModalHeader>
                    <ModalBody>
                        <strong>{this.state.selectedExam.exam_name}</strong> adlı sınavı {this.props.course_name} adlı kurstan silmek istediğinize emin misiniz?
                        </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.deleteExam(this.state.selectedExam.id)}>Sil</Button>
                        <Button color="primary" onClick={this.closeModal}>Geri Dön</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.updateExamModal} >
                    <ModalHeader>Sınavı Güncelle</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="courseName">Sınav Adı:</Label>
                                <Input invalid={this.state.examNameMessage} type="text" name="moduleName" id="moduleName" value={this.state.selectedExam.exam_name} onChange={this.handleExamNameChanged} />
                                <FormText>{this.state.examNameMessage}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleText">Sınav Açıklaması:</Label>
                                <Input invalid={this.state.examDescMessage} type="textarea" name="moduleDesc" id="moduleDesc" value={this.state.selectedExam.exam_description} onChange={this.handleExamDescChanged} />
                                <FormText>{this.state.examDescMessage}</FormText>
                            </FormGroup>

                        </Form>

                        {this.state.updateModalMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateExam}>Güncelle</Button>
                        <Button color="danger" onClick={this.closeUpdateModal}>Kapat</Button>
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

            </div>


        );
    }







}
export default ExamOperations;