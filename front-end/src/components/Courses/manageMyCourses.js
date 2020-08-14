import React, { Component } from 'react'

import {
    Button, Alert, 
    CardHeader, Card, CardBody,  Row, Col
} from 'reactstrap';


import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import ModuleManagement from '../Modules/moduleManagement'

class ManageMyCoursesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            courses: [],
            isLoaded: false,
            alertMessage: "",
            alertColor: "primary",
            chosenTab: 1,
            course: [],
            modalErrorMessage: {
                message1: "",
                message2: "",
                message3: ""
            },
            courseUsers: [],
            modalAddUser: false
        }
    }
    componentDidMount = () => {

        this.getCourses();
    }

    getCourses = () => {
        axios.get('http://localhost:3010/authcommon/getusermanagedcourses').then(res => {
            
            const courses = res.data;
            console.log(courses);
            this.setState({ courses: courses, isLoaded: true });
        }).catch(err => {
            this.setState({ error: err, isLoaded: true })
        });
    }



    togglePage = (number, course) => {
        if (number == 2) {
            this.setState({ course: course, chosenTab: number,  })
        }
    }

    render() {

        let someData = [];
        if (this.state.courses.length > 0 ){
            someData = (
            
                this.state.courses.map((course) =>(
                    {
                        course_name: course.course_name,
                        course_desc: course.course_desc,
                        course_type:course.type_name,
                        course_role:course.role_name,
                        module_opt: <Button color="primary" onClick={() => this.togglePage(2, course)}>Modulleri Yönet</Button>,
                    }
                  ))
    
            );
        }
       

        const data = {
            columns: [
              {
                label: 'Kurs Adı',
                field: 'course_name',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Kurs Açıklaması',
                field: 'course_desc',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Kurs Tipi',
                field: 'course_type',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Kurs Rolü',
                field: 'course_role',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Modulleri Yönet',
                field: 'module_opt',
                sort: 'asc',
                width: 50
              }

  
            ],
            rows: someData
        };

        let table;
        if(this.state.courses.length > 0){
            table = (
                <MDBDataTable
                striped
                bordered
                large
                data={data}
            />
            )
        }
        else {
            table = (
                <p>Yönetici olduğunuz kurs bulunmamaktadır.</p>
            )
        }


        let card = (
            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i> Kursları Düzenle
                      </CardHeader>
                <CardBody>
                <p style = {{marginBottom: "30px"}}><strong>Yönettiğiniz kurslar</strong> bu sayfada görüntülenecektir.</p>
               
                {table}
                    
                </CardBody>
            </Card>
        );

        if (this.state.chosenTab == 2) {
            card = (
                <ModuleManagement course_id = {this.state.course.id}/>
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
export default ManageMyCoursesComponent;