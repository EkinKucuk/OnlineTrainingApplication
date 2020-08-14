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
            reviewHeader: "",
            reviewHeaderMessage: "",
            review: "",
            reviewMessage: "",
            reviewRating: 0,
            ratingMessage: "",
            modalMessage: ""

        }
    }

    clearMessages = () => {
        this.setState( {
            reviewHeaderMessage: "",
            reviewMessage: "",
            ratingMessage: ""

        })
    }


    componentDidMount = () => {

    }

    handleReviewHeaderChanged = (e) => {
        let { value } = e.target;
        this.setState({ reviewHeader: value });
    }
    handleReviewChanged = (e) => {
        let { value } = e.target;
        this.setState({ review: value });
    }
    handleReviewRatingChanged = (e) => {
        let { value } = e.target;
        this.setState({ reviewRating: value })

    }

    addCourseModule = () => {

        this.clearMessages();

        const {reviewHeader , review , reviewRating} = this.state;
        let validated = true;
        if(reviewHeader.length < 3){
            validated = false;
            this.setState({reviewHeaderMessage: "Yorum başlığı en az 3 karakter olmalıdır."})
        }

        if(review.length < 3){
            validated = false;
            this.setState({reviewMessage: "Yorumunuz en az 3 karakter olmalıdır."})
        }

        if(reviewRating === 0){
            validated = false;
            this.setState({ratingMessage: "Lütfen yorumunuz için puan seçiniz."})
        }

      

        if(validated){
            let data = new FormData();
            data.append('course_reviewheader', reviewHeader);
            data.append('course_review', review);
            data.append('course_rating', reviewRating);
            data.append('course_id', this.props.course_id)

            axios.post(`http://localhost:3010/review/addreview`, 
                
                data
                
            ).then(res => {
                const modalMessage = "Yorumunuz başarıyla gönderilmiştir.";
                const modalHeader = "Mesaj";
                const messageModalColor = "blue";
                
                this.props.closeReviewModal(modalMessage, modalHeader, messageModalColor);
                this.clearMessages();

            }).catch(err => {
                this.setState({ modalMessage: "Yorum oluşturulurken sistemsel bir hata oluştu. Lütfen tekrar deneyiniz." })
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
                        <Input invalid={this.state.reviewHeaderMessage} type="text" name="moduleName" id="moduleName" value={this.state.reviewHeader} onChange={this.handleReviewHeaderChanged} />
                        <FormText>{this.state.reviewHeaderMessage}</FormText>
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleText">Yorum:</Label>
                        <Input invalid={this.state.reviewMessage} type="textarea" name="moduleDesc" id="moduleDesc" value={this.state.review} onChange={this.handleReviewChanged} />
                        <FormText>{this.state.reviewMessage}</FormText>
                    </FormGroup>

                    <FormGroup>
                        <Label for="courseType">Puan:</Label>
                        <Input invalid = {this.state.ratingMessage}  type="select" name="moduleType" id="moduleType" value = {this.state.reviewRating} onChange={this.handleReviewRatingChanged}>
                            <option value="0">Seçiniz</option>
                            <option value="1"> 1 </option>
                            <option value="2"> 2 </option>
                            <option value="3"> 3 </option>
                            <option value="4"> 4 </option>
                            <option value="5"> 5 </option>
                            
                        </Input>
                        <FormText>{this.state.ratingMessage}</FormText>
                    </FormGroup>
                
                </Form>

                {this.state.modalMessage}
            </ModalBody>

            <ModalFooter>
                <Button color="primary" onClick={this.addCourseModule}>Yorumu Gönder</Button> 
                <Button color="danger" onClick={() => this.props.closeReviewModal("","","")}>Kapat</Button> 
            </ModalFooter>
            </div>

        );
    }







}
export default ReviewModalComponent;