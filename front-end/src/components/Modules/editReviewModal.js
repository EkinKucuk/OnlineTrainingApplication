import React, { Component } from 'react'
import {
    Button, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator'
class EditReviewModalComponent extends Component {


    constructor(props) {
        super(props);

        this.state = {

            error: null,
            isLoaded: false,
            reviewHeader: this.props.userReview.course_reviewheader,
            oldReviewHeader: this.props.userReview.course_reviewheader,
            reviewHeaderMessage: "",
            review: this.props.userReview.course_review,
            oldReview: this.props.userReview.course_review,
            reviewMessage: "",
            reviewRating: this.props.userReview.course_rating,
            oldReviewRating: this.props.userReview.course_rating,
            ratingMessage: ""

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
        console.log(this.props)
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

    deleteReview = () => {

        this.setState({ alertMessage: "" });
        axios.delete('http://localhost:3010/review/deletecoursereview', {
            data: {
                course_id: this.props.course_id
            }
        })
        .then(res => {
            const modalMessage = "Yorumunuz başarıyla silinmiştir.";
            const modalHeader = "Mesaj";
            const messageModalColor = "blue";
            this.props.closeEditReviewModal(modalMessage, modalHeader, messageModalColor);
            this.clearMessages();
        })
        .catch(err => {
            this.setState({ modalMessage: "Yorumunuz silinirken bir problem yaşanmıştır, lütfen tekrar deneyiniz." })
        });
    }

    updateReview = () => {

        this.clearMessages();

        const {reviewHeader , review , reviewRating, oldReviewHeader, oldReview, oldReviewRating} = this.state;
        let validated = true;

        if (reviewHeader === oldReviewHeader && review === oldReview && oldReviewRating === reviewRating){
            validated = false;
            this.setState({modalMessage: "Değişiklik yapılmamıştır. Lütfen değişiklik yapınız."})
        }

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

            axios.put(`http://localhost:3010/review/updatereview`, 
                
                data
                
            ).then(res => {
                const modalMessage = "Yorumunuz başarıyla güncellenmiştir.";
                const modalHeader = "Mesaj";
                const messageModalColor = "blue";
                this.props.closeEditReviewModal(modalMessage, modalHeader, messageModalColor);
                this.clearMessages();

            }).catch(err => {
                this.setState({ modalMessage: "Yorum güncellenirken bir hata oluştu, lütfen tekrar deneyiniz." })
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
                <Button color="primary" onClick={this.updateReview}>Yorumu Düzenle</Button>
                <Button color="danger" onClick={this.deleteReview}>Yorumu Sil</Button> 
                <Button color="danger" onClick={() => this.props.closeEditReviewModal("","","")}>Kapat</Button> 
            </ModalFooter>
            </div>

        );
    }







}
export default EditReviewModalComponent;