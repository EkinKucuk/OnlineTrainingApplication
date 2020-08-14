import React, { Component } from 'react'

import {
    Alert, 
    CardHeader, Card, CardBody,Row, Col
} from 'reactstrap';


import axios from 'axios';
import { MDBDataTable } from 'mdbreact';

class ListSystemCoursesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            alertMessage: "",
            alertColor: "primary",
            userReviews: [],
            average: 0
        }
    }
    componentDidMount = () => {
        this.getCourseReviews();
    }


    getCourseReviews = () => {
        axios.get('http://localhost:3010/review/getallreviews', {
            params: {
                course_id: this.props.course_id
            }
        }).then(res => {

            console.log(res.data);
            let length = res.data.length;
            if (length > 0){
                const reviews = res.data;
                let sum = 0;
            
                reviews.map((review) => (
                    sum = sum + review.course_rating
                ))

                this.setState({ userReviews: reviews, isLoaded: true, average: sum / length });
            }
            else {
                this.setState({isLoaded: true, userReviews: null });
            }

            
        })
        .catch(err => {
            this.setState({ error: err, isLoaded: true })
        });
    }


    render() {

        const { alertMessage, alertColor, course, modalMessage, modalErrorMessage } = this.state;
        let someData = [];
        if (this.state.userReviews !== null ){
            someData = (
            
                this.state.userReviews.map((review) =>(
                    {
                        course_reviewheader: review.course_reviewheader,
                        course_review: review.course_review,
                        course_rating: review.course_rating,
                    }
                  ))
    
            );
        }
       

        const data = {
            columns: [
              {
                label: 'Başlık',
                field: 'course_reviewheader',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Yorum',
                field: 'course_review',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Puan',
                field: 'course_rating',
                sort: 'asc',
                width: 200
              },
      

  
            ],
            rows: someData
        };


        const alertTop = {
            marginTop: "10px"
        };


        let alert;
        if (alertMessage !== "") {
            alert = (
                <div style={alertTop}>
                    <Alert color={alertColor}>
                        {alertMessage}
                    </Alert>
                </div>
            )
        }
        let card
        if (this.state.userReviews !== null ){
             card = (
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> Yorumları İncele
                          </CardHeader>
                    <CardBody>
                    <MDBDataTable
                                striped
                                bordered
                                large
                                data={data}
                            />
                    <p><strong>Kurs Averaj Puanı: {this.state.average}</strong></p>
                        {alert}
                    </CardBody>

                </Card>
            );
    
        }
        else {
            card = (
                <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i> Yorumları İncele
                      </CardHeader>
                <CardBody>
                    <p>İncelencek yorum bulunmamaktadır.</p>
              
                </CardBody>
            </Card>
            )
        }


        



        return (
            
            <div>

                <Row>
                    <Col>
                        {card}
                    </Col>
                </Row>
         
            </div>




        );
    }
}
export default ListSystemCoursesComponent;