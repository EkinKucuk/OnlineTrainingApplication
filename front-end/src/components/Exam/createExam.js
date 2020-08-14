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
    FormText,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator'
class CreateExamModuleComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            alertMessage: "",
            examName: "",
            examDesc: "",
            modalHeader: "",
            modalMessage: "",
            messageModal: false,
            messageModalColor: "",
        }
    }
    componentDidMount = () => {
        this.setState({ isLoaded: true })
    }

    clearMessages = () => {
        this.setState({
            examNameMessage: "",
            examDescMessage: "",
            alertMessage: ""
        })
    }

    clearForm = () => {
        this.setState({
            examName: "",
            examDesc: "",
        })
    }

    closeMessageModal = () => {
        this.setState({ messageModal: false });
    }


    handleExamNameChanged = (e) => {
        let { value } = e.target;
        this.clearMessages();
        this.setState({ examName: value });
    }
    handleExamDescChanged = (e) => {
        let { value } = e.target;
        this.clearMessages();
        this.setState({ examDesc: value });
    }

    addExam = () => {


        this.clearMessages();

        const { examName, examDesc } = this.state;
        let validated = true;
        if (examName.length < 3) {
            validated = false;
            this.setState({ examNameMessage: "Sınav ismi en az 3 karakter olmalıdır." })
        }

        if (examDesc.length < 3) {
            validated = false;
            this.setState({ examDescMessage: "Sınav açıklaması en az 3 karakter olmalıdır." })
        }


        if (validated) {
            let data = new FormData();
            data.append('exam_name', examName);
            data.append('exam_description', examDesc);
            data.append('course_id', this.props.course_id)

            axios.post(`http://localhost:3010/exam/createexam`,

                data

            ).then(res => {
                this.setState({  modalMessage:"Sınav başarıyla yaratılmıştır.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true  });
                this.clearForm();

            }).catch(err => {
                this.setState({ modalMessage:"Sınav yaratılırken bir problem oluşmuştur. Lütfen tekrar deneyiniz.", modalHeader:"Hata Mesajı", messageModalColor:"red",messageModal:true })
            });
        }

    }
    render() {

        const {
            isLoaded,
            error,
            alertMessage,
            alertColor
        } = this.state;

        const alertStyle = {
            marginTop: "10px"
        };

        if (isLoaded == false) {
            return (<div>

                <Spinner color="primary" />
            </div>)
        } else if (error) {
            return (<div>

                <p>Verilere ulaşmaya çalışırken hata oluşmuştur.</p>
            </div>)

        } else {
            let alert;
            if (alertMessage !== "") {
                alert = (<div style={alertStyle}>
                    <Alert color={alertColor}>
                        {alertMessage}
                    </Alert>
                </div>)
            }

            return (<div>
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                Sınav Yaratma
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="courseName">Sınav Adı:   </Label>
                                        <Input invalid={this.state.examNameMessage} type="text" name="moduleName" id="moduleName" value={this.state.examName} onChange={this.handleExamNameChanged} />
                                        <FormText>{this.state.examNameMessage}</FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">Sınav Açıklaması: </Label>
                                        <Input invalid={this.state.examDescMessage} type="textarea" name="moduleDesc" id="moduleDesc" value={this.state.examDesc} onChange={this.handleExamDescChanged} />
                                        <FormText>{this.state.examDescMessage}</FormText>
                                    </FormGroup>


                                    <FormGroup>
                                        <Button color="primary" onClick={this.addExam}>Sınav Ekle</Button>
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


            </div>);
        }

    }

}
export default CreateExamModuleComponent;