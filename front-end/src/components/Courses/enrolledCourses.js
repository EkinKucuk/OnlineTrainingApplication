import React, { Component } from 'react'
import {
  Button, Spinner,
  Alert,
  Table
} from 'reactstrap';
import axios from 'axios';

class ViewEnrolledCourseComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      courses: []
    }
  }
  componentDidMount = () => {


  }
  getUserCorses = () => {
    axios.get('http://localhost:3010/course/getcoursebyuserid').then(res => {
      const courses = res.data;
      this.setState({ courses: courses, isLoaded: true });
    }).catch(err => {
      this.setState({ error: err, isLoaded: true })
    });
  }
  goToCourse = () => {

  }

  render() {


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
      return (

        <div>
          <Table>
            <thead>
              <tr>
                <th>Kurs Adı</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.course_name}</td>
                  <td>{course.course_desc}</td>
                  <td>{course.course_type}</td>
                  <td><Button color="info" onClick={() => this.goToCourse()}>Kursa Git</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          {alert}

        </div>
      );
    }
  }





}
export default ViewEnrolledCourseComponent;
