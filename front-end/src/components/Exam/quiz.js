import React, { Component } from 'react';
import Question from './question';
import axios from 'axios';
import {
    Button,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Card,
    CardBody
} from 'reactstrap';

class Quiz extends Component {

    constructor(props) {
        super(props);
        this.state = {
            start: false,
            shuffle: true,
            showInstantFeedback: true,
            continueTillCorrect: false,
            exam: null,
            questions: []

        }
    }
    start = () => {
        this.setState({ start: true })
    }

    getQuestions = () => {
        console.log(this.props);
        axios.get('http://localhost:3010/exam/getquestions', {
            params: {
                exam_id: this.props.exam.id
            }
        }).then(res => {

            console.log(res.data);
            if (res.data.length > 0) {
                const questions = res.data;
                console.log(questions);

                const { exam } = this.props;

                const examObject = {
                    "examTitle": exam.exam_name,
                    "examDescription": exam.exam_description,
                    "questions": []
                };

                let object;

                for (let i = 0; i < res.data.length; i++) {
                    object = {
                        "question": res.data[i][0].question_name,
                        "questionType": "text",
                        "answers": [],
                        "correctAnswer": "",
                        "messageForCorrectAnswer": "Doğru cevap.",
                        "messageForIncorrectAnswer": "Yanlış cevap.",
                        "explanation": res.data[i][0].answer_description,
                    }

                    for (let k = 0; k < res.data[i].length; k++) {

                        object.answers.push(
                            res.data[i][k].answer
                        )

                        if (res.data[i][k].correct_answer == true) {
                            object.correctAnswer = k + 1;
                        }
                    }

                    examObject.questions.push(object);

                }

                let examQuestions = examObject.questions;
                if (this.state.shuffle) {
                    examQuestions = this.shuffleQuestions(examQuestions);
                }
    
                examQuestions = examQuestions.map((question, index) => ({
                    ...question,
                    questionIndex: index + 1
                }));
    
                this.setState({exam: examObject, questions: examQuestions});
                console.log(examObject);



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
        this.getQuestions();
    }

    shuffleQuestions = (questions) => {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        return questions;
    }

    render() {
        const { exam, shuffle, showInstantFeedback, continueTillCorrect } = this.state;

        let card;
        if (exam !== null) {
 
            card = (
                <div className="react-quiz-container">
                    {!this.state.start &&
                        <div>
                            <h2>{exam.examTitle}</h2>
                            <div>{exam.questions.length} adet soru bulunmaktadır.</div>
                            {exam.examDescription &&
                                <div className="quiz-synopsis">
                                    {exam.examDescription}
                                </div>
                            }
                            <div className="startQuizWrapper">
                                <Button onClick={() => this.start()} color = "primary">Sınava Başla</Button>
                            </div>
                        </div>
                    }

                    {
                        this.state.start && <Question questions={this.state.questions} showInstantFeedback={showInstantFeedback} continueTillCorrect={continueTillCorrect} />
                    }
                </div>
            )
        }




        return (
            <div>
            <ModalBody>
                <Row>
                <Col>
                    <Card>
              
                        <CardBody>

                            {card}
                        </CardBody>
                    </Card>

                </Col>
            </Row>
            </ModalBody>
            
                <ModalFooter>
                <Button color= "danger" onClick = {this.props.closeExamModal}>Kapat</Button>
                </ModalFooter>
                </div>
        );
    }




}
export default Quiz;