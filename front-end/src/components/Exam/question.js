import React, { Component } from 'react';
import {
    Button,
    Input
  } from 'reactstrap';
import './styles.css'

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incorrectAnswer: false,
            correctAnswer: false,
            showNextQuestionButton: false,
            endQuiz: false,
            currentQuestionIndex: 0,
            buttons: {},
            buttonClasses: {},
            questions:[],
            correct: [],
            incorrect: [],
            incorrectAnswers: {},
            filteredValue: 'all',
            showDefaultResult: this.props.showDefaultResult != undefined ? this.props.showDefaultResult : true,
            onComplete: this.props.onComplete != undefined ? this.props.onComplete : null,
            customResultPage: this.props.customResultPage != undefined ? this.props.customResultPage : null,
            showInstantFeedback: this.props.showInstantFeedback != undefined ? this.props.showInstantFeedback : false,
            continueTillCorrect: this.props.continueTillCorrect != undefined ? this.props.continueTillCorrect : false
        };
    }

    checkAnswer = (index, correctAnswer) => {
        const { correct, incorrect, currentQuestionIndex, showInstantFeedback, continueTillCorrect, incorrectAnswers } = this.state;

        if (index == correctAnswer) {
            if (incorrect.indexOf(currentQuestionIndex) < 0 && correct.indexOf(currentQuestionIndex) < 0) {
                correct.push(currentQuestionIndex);
            }

            let disabledAll = {
                0: { disabled: true },
                1: { disabled: true },
                2: { disabled: true },
                3: { disabled: true }
            }

            this.setState((prevState) => {
                const buttons = Object.assign(
                    {},
                    prevState.buttons,
                    {
                        ...disabledAll,
                        [index - 1]: {
                            className: (index == correctAnswer) ? "correct" : "incorrect"
                        },
                    }
                );
                return { buttons };
            })

            this.setState({
                correctAnswer: true,
                incorrectAnswer: false,
                correct: correct,
                showNextQuestionButton: true,
            })
        } else {
            if (correct.indexOf(currentQuestionIndex) < 0 && incorrect.indexOf(currentQuestionIndex) < 0) {
                incorrect.push(currentQuestionIndex)
                incorrectAnswers[currentQuestionIndex] = index;
            }

            if (continueTillCorrect) {
                this.setState((prevState) => {
                    const buttons = Object.assign(
                        {},
                        prevState.buttons,
                        {
                            [index - 1]: {
                                disabled: !prevState.buttons[index - 1]
                            }
                        }
                    );
                    return { buttons };
                });
            } else {
                let disabledAll = {
                    0: { disabled: true },
                    1: { disabled: true },
                    2: { disabled: true },
                    3: { disabled: true }
                }

                this.setState((prevState) => {
                    const buttons = Object.assign(
                        {},
                        prevState.buttons,
                        {
                            ...disabledAll,
                            [index - 1]: {
                                className: (index == correctAnswer) ? "correct" : "incorrect"
                            },
                        }
                    );
                    return { buttons };
                })

                this.setState({
                    showNextQuestionButton: true,
                })
            }

            this.setState({
                incorrectAnswer: true,
                correctAnswer: false,
                incorrect: incorrect,
                incorrectAnswers: incorrectAnswers
            })
        }
    }

    nextQuestion = (currentQuestionIndex) => {
        const { questions } = this.props;

        var initState = {
            incorrectAnswer: false,
            correctAnswer: false,
            showNextQuestionButton: false,
            buttons: {},
        }

        if (currentQuestionIndex + 1 == questions.length) {
            this.setState({
                ...initState,
                endQuiz: true
            })
        } else {
            this.setState({
                ...initState,
                currentQuestionIndex: currentQuestionIndex + 1,
            })
        }
    }

    renderMessageforCorrectAnswer = (question) => {
        const defaultMessage = 'Doğru cevaplanmıştır.';
        return question.messageForCorrectAnswer || defaultMessage;
    }

    renderMessageforIncorrectAnswer = (question) => {
        const defaultMessage = 'Yanlış cevap. Lütfen Tekrar deneyiniz.';
        return question.messageForIncorrectAnswer || defaultMessage;
    }

    renderExplanation = (question, isResultPage) => {
        const explanation = question.explanation;
        if (!explanation) {
            return (null);
        }

        if (isResultPage) {
            return (
                <div className="explaination">
                    {explanation}
                </div>
            )
        }

        return (
            <div>
                <br />
                {explanation}
            </div>
        )
    }
    handleChange = (event) => {
        this.setState({ filteredValue: event.target.value });
    }

    renderQuizResultFilter = () => {
        return (
            <div>
                <Input style = {{marginBottom: "10px"}}type = "select" value={this.state.filteredValue} onChange={this.handleChange}>
                    <option value="all">Tüm Sorular</option>
                    <option value="correct">Doğru Cevaplananlar</option>
                    <option value="incorrect">Yanlış Cevaplananlar</option>
                </Input>
            </div>
        );
    }
    renderQuizResultQuestions = () => {
        const { filteredValue } = this.state;
        let questions = this.props.questions;
        

        if (filteredValue != 'all') {
            questions = questions.filter((question, index) => {
                return this.state[filteredValue].indexOf(index) != -1
            })
        }

        return questions.map((question, index) => {
            return (
                <div class="result-answer-wrapper" key={index + 1}>
                    <h3>
                        S{question.questionIndex}: {question.question}
                    </h3>
                    <div className="result-answer">
                        {
                            question.answers.map((answer, index) => {
                                console.log(this.state.incorrectAnswers);
                                console.log(question.questionIndex);
                                console.log(index);
                                return (
                                    <div>
                                        <Button disabled={true} className={"answerBtn btn" + (index + 1 == question.correctAnswer ? ' correct' : '') + (this.state.incorrectAnswers[question.questionIndex - 1] == index + 1 ? ' incorrect' : '')}>
                                            {question.questionType == 'text' && <span>{answer}</span>}
                                            {question.questionType == 'photo' && <img src={answer} />}
                                        </Button>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {this.renderExplanation(question, true)}
                </div>
            )
        })
    }
    render() {
        const { questions } = this.props;
        const questionSummary = {
            numberOfQuestions: this.props.questions.length,
            numberOfCorrectAnswers: this.state.correct.length,
            numberOfIncorrectAnswers: this.state.incorrect.length,
            questions: this.props.questions
        };
        let question = questions[this.state.currentQuestionIndex];

        return (
            
            <div className="questionWrapper">
           
                {!this.state.endQuiz &&
                    <div className="questionWrapperBody">
                        <div className="questionModal">
                            {this.state.incorrectAnswer && this.state.showInstantFeedback &&
                                <div className="alert incorrect">{this.renderMessageforIncorrectAnswer(question)}</div>
                            }
                            {this.state.correctAnswer && this.state.showInstantFeedback &&
                                <div className="alert correct">
                                    {this.renderMessageforCorrectAnswer(question)}
                                    {this.renderExplanation(question, false)}
                                </div>
                            }
                        </div>
                        <div>Soru {this.state.currentQuestionIndex + 1}:</div>
                        <hr></hr>
                        <h3>{question.question}</h3>
                        {
                            question.answers.map((answer, index) => {
                                if (this.state.buttons[index] != undefined) {
                                    return (
                                        <Button key={index} disabled={this.state.buttons[index].disabled || false} className={`${this.state.buttons[index].className} answerBtn btn`} onClick={() => this.checkAnswer(index + 1, question.correctAnswer)}>
                                            {question.questionType == 'text' && <span>{answer}</span>}
                                            {question.questionType == 'photo' && <img src={answer} />}
                                        </Button>
                                    )
                                } else {
                                    return (
                                        <Button key={index} onClick={() => this.checkAnswer(index + 1, question.correctAnswer)} className="answerBtn btn">
                                            {question.questionType == 'text' && answer}
                                            {question.questionType == 'photo' && <img src={answer} />}
                                        </Button>
                                    )
                                }
                            })
                        }
                        {this.state.showNextQuestionButton &&
                            <div><Button onClick={() => this.nextQuestion(this.state.currentQuestionIndex)} className="nextQuestionBtn btn">Sonraki Soru</Button></div>
                        }
                    </div>
                }
                {this.state.endQuiz && this.state.showDefaultResult && this.state.customResultPage == null &&
                    <div>
                        <h2>Sınavı tamamladınız. Sınavdan {questions.length} üzerinden {this.state.correct.length} aldınız. <br /></h2>
                        {this.renderQuizResultFilter()}
                        {this.renderQuizResultQuestions()}
                    </div>
                }

                {
                    this.state.endQuiz && this.state.onComplete != undefined &&
                    this.state.onComplete(questionSummary)
                }

                {
                    this.state.endQuiz && !this.state.showDefaultResult && this.state.customResultPage != undefined &&
                    this.state.customResultPage(questionSummary)
                }
               
            </div>
        );


    }





}

export default Question;