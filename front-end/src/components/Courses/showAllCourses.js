import React, { Component } from 'react'
import {
    Button, CardHeader, Card, CardBody, CardFooter,  Row, Col

} from 'reactstrap';
import CourseModuleComponent from '../Modules/courseModule';
import axios from 'axios';

class AllCoursesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            courses: [],
            isLoaded: false,
            alertMessage: "",
            alertColor: "primary",
            show: false,
            choosenPage: 1,
            selectedCourse: null
        }
    }
    getCourses = () => {
        axios.get('http://localhost:3010/course/getusercourses/').then(res => {
            const courses = res.data;
            this.setState({ courses: courses, isLoaded: true });
        }).catch(err => {
            this.setState({ error: err, isLoaded: true })
        });
    }

    goBackToCoursesPage = () => {
        this.setState({ choosenPage: 1})
    }

    goToCourseModule = (course) => {

        this.setState({selectedCourse:course})
        this.setState({ show: true,choosenPage:2 })
    }
    componentDidMount = () => {
        this.getCourses();
    }


    render() {

        const style = {

            height: "200px"
        }

        const styleCol = {
            width: "300px",
            height: "250px"
        }

        let card 

        if(this.state.courses.length > 0 && this.state.choosenPage == 1){
            card = (
                <div>
                <p>
                    <strong>Eğer bulunduğunuz kurs aktif değilse</strong> bu sayfada görüntülenmez.
                </p>
               <Row>
                        {this.state.courses.map((course, index) => (
                           <Col key={course.id}>
                                <Card style={style} key={index}>
                                    <CardHeader className="text-white bg-primary">
                                        <div className="text-value">{course.course_name}</div>
                                    </CardHeader>
                                    <CardBody className="pb-0">
    
    
                                        <div>{course.course_desc}</div>
    
                                    </CardBody>
                                    <CardFooter>
                                        <Button color="primary" onClick={() => this.goToCourseModule(course)}>Kursa Git</Button>
                                
                                    </CardFooter>
                                </Card>
                                </Col>
                        ))}
                  </Row>
                  </div>
              
            );
        }
        else {
            card = (
                <div>
                <p><strong>Eğer bulunduğunuz kurs aktif değilse</strong> bu sayfada görüntülenmez.</p>
                <p style = {{marginTop: "20px"}}>Katılımcı olduğunuz kurs bulunmamaktadır.</p>
                </div>
            )
        }
        
        if(this.state.choosenPage===2){
            card=(
                <div>
                    <Button onClick = {() => this.goBackToCoursesPage()} color = "danger">Geri Dön</Button>
                     <CourseModuleComponent course_id={this.state.selectedCourse.id} course_name = {this.state.selectedCourse.course_name}/> 

                </div>
                
            );
        }

        return (

            <div>
                 {card}
            </div>
        );
    }
}
export default AllCoursesComponent;