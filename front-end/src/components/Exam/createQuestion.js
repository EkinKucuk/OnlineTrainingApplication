import React, { Component } from 'react'
import {
    Button,
    Spinner,
    FormGroup,
    Input,
    Label,
    Form,
    Alert,
    Card,
    Col,
    Row,
    CardBody,
    CardHeader,
    FormText, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';
import Validator from 'validator'

class CreateExamComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            alertMessage: "",
            question: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            displayedQuestions: [],
            correct_answer: 0,
            questions: [],
            editQuestionModal: false,
            areYouSureModal: false,
            deleteQuestionModal: false,
            messageModal: false,
            messageModalColor: "",
            modalHeader: "",
            modalMessage: "",
            chosenQuestionId: "",
            chosenQuestionName: "",
            chosenQuestionAnswers: [],
            chosenCorrectAnswer: "",
            answerDescription: "",
            editCorrectAnswer: 0
        }
    }


    componentDidMount = () => {
        this.getQuestions();

    }
    closeEditQuestionModal = () => {
        this.setState({ editQuestionModal: false });
    }
    closeDeleteQuestionModal = () => {
        this.setState({ deleteQuestionModal: false });
    }
    closeAreYouSureModal = () => {
        this.setState({ areYouSureModal: false });
    }
    closeMessageModal = () => {
        this.setState({ messageModal: false });
    }
    handleQuestionChange = (e) => {
        let { value } = e.target;
        this.setState({ question: value });
        //this.setState({ ...questions, question: value });
    }
    handleChoice1Change = (e) => {
        let { value } = e.target;
        this.setState({ answer1: value });
        //this.setState({ ...questions, answer1: value });
    }
    handleChoice2Change = (e) => {
        let { value } = e.target;
        this.setState({ answer2: value });
        //this.setState({ ...questions, answer2: value });
    }
    handleChoice3Change = (e) => {
        let { value } = e.target;
        this.setState({ answer3: value });
        //this.setState({ ...questions, answer3: value });
    }
    handleChoice4Change = (e) => {
        let { value } = e.target;
        this.setState({ answer4: value });
        // this.setState({ ...questions, answer4: value });
    }
    handleCorrectAnswerChange = (e) => {
        let { value } = e.target;
        this.setState({ correct_answer: value });
        //this.setState({ ...questions, correctanswer: value });
    }

    handleAnswerDescriptionChange = (e) => {
        let { value } = e.target;
        this.setState({ answerDescription: value });
        //this.setState({ ...questions, correctanswer: value });
    }


    handleEditQuestionChange = (e) => {
        let { value } = e.target;
        this.setState({ editQuestion: value });
        //this.setState({ ...questions, question: value });
    }
    handleEditChoice1Change = (e) => {
        let { value } = e.target;
        this.setState({ editAnswer1: value });
        //this.setState({ ...questions, answer1: value });
    }
    handleEditChoice2Change = (e) => {
        let { value } = e.target;
        this.setState({ editAnswer2: value });
        //this.setState({ ...questions, answer2: value });
    }
    handleEditChoice3Change = (e) => {
        let { value } = e.target;
        this.setState({ editAnswer3: value });
        //this.setState({ ...questions, answer3: value });
    }
    handleEditChoice4Change = (e) => {
        let { value } = e.target;
        this.setState({ editAnswer4: value });
        // this.setState({ ...questions, answer4: value });
    }
    handleEditCorrectAnswerChange = (e) => {
        let { value } = e.target;
        this.setState({ editCorrectAnswer: value });
        //this.setState({ ...questions, correctanswer: value });
    }

    handleEditAnswerDescriptionChange = (e) => {
        let { value } = e.target;
        this.setState({ editAnswerDescription: value });
        //this.setState({ ...questions, correctanswer: value });
    }
    
    getQuestions = () => {
        axios.get('http://localhost:3010/exam/getquestions', {
            params: {
                exam_id: this.props.exam.id
            }
        }).then(res => {
            const questions = res.data;
            this.setState({ displayedQuestions: questions, isLoaded: true });
        }).catch(err => {
            this.setState({ error: err, isLoaded: true })
        });

    }
    deleteQuestionbyId = (questionId) => {

        this.setState({ alertMessage: "" });
        axios.delete('http://localhost:3010/exam/deletequestion', {
            data: {
                exam_id: this.props.exam.id,
                question_id: this.state.chosenQuestionId
            }
        })
            .then(res => {
                this.closeAreYouSureModal();
                this.setState({ modalMessage: "Soru başarıyla silinmiştir.", modalHeader: "Mesaj", messageModalColor: "blue", messageModal: true, alertColor: "primary" });
                this.getQuestions();
            })
            .catch(err => {
                this.closeAreYouSureModal();
                this.setState({ modalMessage: "Soru silinirken problem yaşanmıştır lütfen tekrar deneyiniz.", modalHeader: "Hata Mesajı", messageModalColor: "red", messageModal: true, alertColor: "danger" })
            });
    }

    toggleEditQuestionModal = (question) => {
        console.log(question);

        let correctAnswer;
        for(let i = 0; i < question.length; i++){
            if(question[i].correct_answer === true){
                correctAnswer = i + 1;
                break;
            }
        }


        this.setState({
            editQuestionModal: true,
            selectedQuestionId: question[0].question_id,
            editQuestion: question[0].question_name,
            editAnswer1: question[0].answer,
            editAnswer1Id: question[0].id,
            editAnswer2: question[1].answer,
            editAnswer2Id: question[1].id,
            editAnswer3: question[2].answer,
            editAnswer3Id: question[2].id,
            editAnswer4: question[3].answer,
            editAnswer4Id: question[3].id,
            editCorrectAnswer: correctAnswer,
            editAnswerDescription: question[0].answer_description
        })
    }
    toggleDeleteQuestionModal = (question_id) => {
        this.setState({
            areYouSureModal: true,
            chosenQuestionId: question_id
        })

    }

    clearMessages = () => {
        this.setState({
            questionMessage: "",
            answer1Message: "",
            answer2Message: "",
            answer3Message: "",
            answer4Message: "",
            answerDescriptionMessage: "",
            correctAnswerMessage: ""
        })
    }

    clearForm = () => {
        this.setState({
            question: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            answerDescription: "",
            correct_answer: 0,
        })
    }

    addQuestion = () => {

        this.clearMessages();


        let validated = true;

        const {
            question,
            answer1,
            answer2,
            answer3,
            answer4,
            answerDescription,
            correct_answer
        } = this.state;

        if (question.length < 3) {
            validated = false;
            this.setState({ questionMessage: "Soru en az 3 karakter olmalıdır." })
        }
        if (Validator.isEmpty(answer1)) {
            validated = false;
            this.setState({ answer1Message: "Lütfen cevap giriniz." })
        }

        if (Validator.isEmpty(answer2)) {
            validated = false;
            this.setState({ answer2Message: "Lütfen cevap giriniz." })
        }

        if (Validator.isEmpty(answer3)) {
            validated = false;
            this.setState({ answer3Message: "Lütfen cevap giriniz." })
        }

        if (Validator.isEmpty(answer4)) {
            validated = false;
            this.setState({ answer4Message: "Lütfen cevap giriniz." })
        }

        if (answerDescription.length < 3) {
            validated = false;
            this.setState({ answerDescriptionMessage: "Cevap açıklaması en az 3 karakter olmalıdır." });
        }

        if (correct_answer === 0) {
            validated = false;
            this.setState({ correctAnswerMessage: "Lütfen doğru cevabı seçiniz." })
        }

        if (validated == true) {
            let data = new FormData();
            data.append('exam_id', this.props.exam.id);
            data.append('question_name', this.state.question);
            data.append('answer_description', this.state.answerDescription);
            data.append('answer1', this.state.answer1)
            data.append('answer2', this.state.answer2)
            data.append('answer3', this.state.answer3)
            data.append('answer4', this.state.answer4)
            data.append('correct_answer', this.state.correct_answer)

            axios.post(`http://localhost:3010/exam/createquestion`,

                data

            ).then(res => {
                this.setState({ modalMessage: "Soru başarıyla eklenmiştir.", modalHeader: "Mesaj", messageModalColor: "blue", messageModal: true });
                this.getQuestions();
                this.clearForm();

            }).catch(err => {
                this.setState({ modalMessage: "Soru eklenirken bir problem yaşanmıştır. Lütfen sistem yetkililerine ulaşınız.", modalHeader: "Hata Mesajı", messageModalColor: "red", messageModal: true })
            });
        }
    }

    editQuestion = () => {

        this.clearMessages();
        
        
        let validated = true;

        const {
            editQuestion,
            editAnswer1,
            editAnswer2,
            editAnswer3,
            editAnswer4,
            editAnswerDescription,
            editCorrectAnswer,
            editAnswer1Id,
            editAnswer2Id,
            editAnswer3Id,
            editAnswer4Id,

        } = this.state;
        console.log(editCorrectAnswer);
        if (editQuestion.length < 3) {
            validated = false;
            this.setState({ editQuestionMessage: "Soru en az 3 karakter olmalıdır." })
        }
        if (Validator.isEmpty(editAnswer1)) {
            validated = false;
            this.setState({ editAnswer1Message: "Lütfen cevap giriniz." })
        }

        if (Validator.isEmpty(editAnswer2)) {
            validated = false;
            this.setState({ editAnswer2Message: "Lütfen cevap giriniz." })
        }

        if (Validator.isEmpty(editAnswer3)) {
            validated = false;
            this.setState({ editAnswer3Message: "Lütfen cevap giriniz." })
        }

        if (Validator.isEmpty(editAnswer4)) {
            validated = false;
            this.setState({ editAnswer4Message: "Lütfen cevap giriniz." })
        }

        if (editAnswerDescription.length < 3) {
            validated = false;
            this.setState({ editAnswerDescriptionMessage: "Cevap açıklaması en az 3 karakter olmalıdır." });
        }

        if (editCorrectAnswer == 0) {
            validated = false;
            this.setState({ editCorrectAnswerMessage: "Lütfen doğru cevabı seçiniz." })
        }

        if (validated == true) {
            let data = new FormData();
            data.append('question_id', this.state.selectedQuestionId);
            data.append('question_name', editQuestion);
            data.append('answer_description', editAnswerDescription);
            data.append('answer1', editAnswer1)
            data.append('answer2', editAnswer2)
            data.append('answer3', editAnswer3)
            data.append('answer4', editAnswer4)
            data.append('editAnswer1Id', editAnswer1Id)
            data.append('editAnswer2Id', editAnswer2Id)
            data.append('editAnswer3Id', editAnswer3Id)
            data.append('editAnswer4Id', editAnswer4Id)
            data.append('correct_answer', editCorrectAnswer)

            axios.put(`http://localhost:3010/exam/editquestion`,

                data

            ).then(res => {
                this.setState({ modalMessage: "Soru başarıyla düzenlenmiştir.", modalHeader: "Mesaj", messageModalColor: "blue", messageModal: true, editQuestionModal: false });
                this.getQuestions();
                this.clearForm();

            }).catch(err => {
                this.setState({ editModalMessage: "Soru düzenlenirken problem yaşanmıştır." })
            });
        }
    }

    render() {

        const {
            isLoaded,
            error
        } = this.state;


        if (isLoaded == false) {
            return (<div>

                <Spinner color="primary" />
            </div>)
        } else if (error) {
            return (<div>

                <p>Verilere ulaşmaya çalışırken hata oluşmuştur.</p>
            </div>)

        } else {

            let someData = [];
            for (let i = 0; i < this.state.displayedQuestions.length; i++){

                someData.push(
                    {
                        question_name: this.state.displayedQuestions[i][0].question_name,
                        edit: <Button color="primary" onClick={() => this.toggleEditQuestionModal(this.state.displayedQuestions[i])}>Düzenle</Button>,
                        del: <Button color="danger" onClick={() => this.toggleDeleteQuestionModal(this.state.displayedQuestions[i][0].question_id)}>Sil</Button>
                    }
                )
            }


      
       
            const data = {
                columns: [
                    {
                        label: 'Soru Adı',
                        field: 'question_name',
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
                        field: 'del',
                        sort: 'asc',
                        width: 50
                    },

                ],
                rows: someData
            };

            let tablePrint;

            if(this.state.displayedQuestions.length){
                tablePrint = (
                    <MDBDataTable
                                striped
                                bordered
                                large
                                data={data}
                            />
                )
            }
            else {
                tablePrint = (
                    <p>Soru eklenmemiştir.</p>
                )
            }

            return (
                <div>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i> Soruları Düzenle
                      </CardHeader>
                        <CardBody>
                            
                        {tablePrint}

                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i> Soru Ekle
                      </CardHeader>
                        <CardBody>
                            <Form>
                                <div>
                                    <FormGroup>
                                        <Label for="question">Soru İsmi</Label>
                                        <Input invalid={this.state.questionMessage} type="text" name="question" id="question" value={this.state.question} onChange={this.handleQuestionChange} />
                                    </FormGroup>
                                    <FormText>{this.state.questionMessage}</FormText>
                                </div>
                                <h4>Şıklar:</h4>

                                <FormGroup>
                                    <Label for="exampleText">Soru 1: </Label>
                                    <Input invalid={this.state.answer1Message} type="text" name="moduleDesc" id="moduleDesc" value={this.state.answer1} onChange={this.handleChoice1Change} />
                                    <FormText>{this.state.answer1Message}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">Soru 2: </Label>
                                    <Input invalid={this.state.answer2Message} type="text" name="moduleDesc" id="moduleDesc" value={this.state.answer2} onChange={this.handleChoice2Change} />
                                    <FormText>{this.state.answer2Message}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">Soru 3: </Label>
                                    <Input invalid={this.state.answer3Message} type="text" name="moduleDesc" id="moduleDesc" value={this.state.answer3} onChange={this.handleChoice3Change} />
                                    <FormText>{this.state.answer3Message}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">Soru 4: </Label>
                                    <Input invalid={this.state.answer4Message} type="text" name="moduleDesc" id="moduleDesc" value={this.state.answer4} onChange={this.handleChoice4Change} />
                                    <FormText>{this.state.answer4Message}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="courseType">Doğru Cevap:</Label>
                                    <Input invalid={this.state.editCorrectAnswerMessage} type="select" name="moduleType" id="moduleType" value={this.state.correct_answer} onChange={this.handleCorrectAnswerChange}>
                                        <option value="0">Doğru Cevap Seçiniz</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </Input>
                                    <FormText>{this.state.editCorrectAnswerMessage}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">Soru Açıklaması: </Label>
                                    <Input invalid={this.state.answerDescriptionMessage} type="text" name="moduleDesc" id="moduleDesc" value={this.state.answerDescription} onChange={this.handleAnswerDescriptionChange} />
                                    <FormText>{this.state.answerDescriptionMessage}</FormText>
                                </FormGroup>
                                <Button onClick={this.addQuestion} color="primary">Soru Ekle</Button>
                            </Form>
                        </CardBody>
                    </Card>

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
                        <ModalHeader toggle={this.closeAreYouSureModal}>Soru Silme Onayı</ModalHeader>

                        <ModalBody>
                            <p> Soruyu silmek istediğinizden emin misiniz?</p>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.deleteQuestionbyId}>Sil</Button>
                            <Button color="primary" onClick={this.closeAreYouSureModal}>Kapat</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.editQuestionModal} toggle={this.closeEditQuestionModal}>
                        <ModalHeader toggle={this.closeEditQuestionModal}>Soru Düzenleme</ModalHeader>

                        <ModalBody>
                        <Form>
                                <div>
                                    <FormGroup>
                                        <Label for="question">Soru İsmi</Label>
                                        <Input invalid={this.state.editQuestionMessage} type="text" name="question" id="question" value={this.state.editQuestion} onChange={this.handleEditQuestionChange} />
                                    </FormGroup>
                                    <FormText>{this.state.editQuestionMessage}</FormText>
                                </div>
                                <h4>Şıklar:</h4>

                                <FormGroup>
                                    <Label for="exampleText">Soru 1: </Label>
                                    <Input invalid={this.state.editAnswer1Message} type="text" name="moduleDesc" id="moduleDesc" value={this.state.editAnswer1} onChange={this.handleEditChoice1Change} />
                                    <FormText>{this.state.editAnswer1Message}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">Soru 2: </Label>
                                    <Input invalid={this.state.editAnswer2Message} type="text" name="moduleDesc" id="moduleDesc" value={this.state.editAnswer2} onChange={this.handleEditChoice2Change} />
                                    <FormText>{this.state.editAnswer2Message}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">Soru 3: </Label>
                                    <Input invalid={this.state.editAnswer3Message} type="text" name="moduleDesc" id="moduleDesc" value={this.state.editAnswer3} onChange={this.handleEditChoice3Change} />
                                    <FormText>{this.state.editAnswer3Message}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">Soru 4: </Label>
                                    <Input invalid={this.state.editAnswer4Message} type="text" name="moduleDesc" id="moduleDesc" value={this.state.editAnswer4} onChange={this.handleEditChoice4Change} />
                                    <FormText>{this.state.editAnswer4Message}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="courseType">Doğru Cevap:</Label>
                                    <Input invalid={this.state.editCorrectAnswerMessage} type="select" name="moduleType" id="moduleType" value={this.state.editCorrectAnswer} onChange={this.handleEditCorrectAnswerChange}>
                                        <option value="0">Doğru Cevap Seçiniz</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </Input>
                                    <FormText>{this.state.editCorrectAnswerMessage}</FormText>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleText">Soru Açıklaması: </Label>
                                    <Input invalid={this.state.editAnswerDescriptionMessage} type="text" name="moduleDesc" id="moduleDesc" value={this.state.editAnswerDescription} onChange={this.handleEditAnswerDescriptionChange} />
                                    <FormText>{this.state.editAnswerDescriptionMessage}</FormText>
                                </FormGroup>

                            </Form>

                            {this.state.editModalMessage}

                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.editQuestion}>Düzenle</Button>
                            <Button color="danger" onClick={this.closeEditQuestionModal}>Kapat</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            )
        }
    }


}
export default CreateExamComponent;