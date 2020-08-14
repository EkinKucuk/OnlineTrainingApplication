import React, { Component } from 'react'
import {
    Button, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator'
class ReviewModalComponent extends Component {


    constructor(props) {
        super(props);

        this.state = {

            error: null,
            isLoaded: false,
            questionHeader: "",
            questionHeaderMessage: "",
            question: "",
            questionMessage: "",

        }
    }

    clearMessages = () => {
        this.setState( {
            questionHeaderMessage: "",
            questionMessage: "",

        })
    }


    componentDidMount = () => {

    }

    handleQuestionHeaderChanged = (e) => {
        let { value } = e.target;
        this.setState({ questionHeader: value });
    }
    handleQuestionChanged = (e) => {
        let { value } = e.target;
        this.setState({ question: value });
    }
    submitQuestion = () => {

        this.clearMessages();

        const {questionHeader , question} = this.state;
        let validated = true;
        if(Validator.isEmpty(questionHeader)){
            validated = false;
            this.setState({questionHeaderMessage: "Lütfen sorunuz için başlık giriniz."})
        }

        if(Validator.isEmpty(question)){
            validated = false;
            this.setState({questionMessage: "Lütfen sorunuzu yazınız."})
        }
      

        if(validated){
            let data = new FormData();
            data.append('course_questionheader', questionHeader);
            data.append('course_question', question);
            data.append('course_id', this.props.course_id)

            axios.post(`http://localhost:3010/course/askquestion`, 
                
                data
                
            ).then(res => {
                //this.setState({ alertMessage: "", alertColor: "primary" });
                this.props.closeReviewModal();
                this.clearMessages();

            }).catch(err => {
                // this.setState({ alertMessage: "Modül yaratılırken bir hata oluştu.", alertColor: "danger" })
            });
        }
        

    }




    render() {


        return (
            <div>
            <ModalBody>

                <Form>
                    <FormGroup>
                        <Label for="courseName">Başlık:</Label>
                        <Input invalid={this.state.questionHeaderMessage} type="text" name="moduleName" id="moduleName" value={this.state.questionHeader} onChange={this.handleQuestionHeaderChanged} />
                        <FormText>{this.state.questionHeaderMessage}</FormText>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleText">Sorunuz:</Label>
                        <Input invalid={this.state.questionMessage} type="textarea" name="moduleDesc" id="moduleDesc" value={this.state.question} onChange={this.handleQuestionChanged} />
                        <FormText>{this.state.questionMessage}</FormText>
                    </FormGroup>
                
                </Form>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" onClick={this.submitQuestion}>Yorumu Gönder</Button> 
                <Button color="danger" onClick={this.props.closeQuestionModal}>Kapat</Button> 
            </ModalFooter>
            </div>

        );
    }







}
export default ReviewModalComponent;