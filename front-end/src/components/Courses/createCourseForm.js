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
  Modal,ModalBody,ModalFooter,ModalHeader
} from 'reactstrap';
import axios from 'axios';
import { AppSwitch } from '@coreui/react'
import Validator from 'validator'
class CreateCourseComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      courseTypes: [],
      choosenCourseType: 0,
      alertMessage: "",
      courseName: "",
      courseType: "",
      courseDescription: "",
      courseObjectives: "",
      courseStatus: false,
      examStatus: false,
      privateCourse: false,
      messageModal:false,
      modalColor:"",
      modalMessage:"",
      modalHeader:"",
      courseNameMessage: "",
      courseTypeMessage: "",
      courseDescriptionMessage: "",
      courseObjectivesMessage: ""
    }
  }

  componentDidMount = () => {

    axios.get('http://localhost:3010/course/getcoursetypes').then(res => {
      const courseTypes = res.data;
      this.setState({ courseTypes: courseTypes, isLoaded: true });
    }).catch(err => {
      this.setState({ error: err, isLoaded: true })
    });


  }
  closeModal=()=>{
    this.setState({messageModal:false});
  }

  clearForm = () => {
    this.setState({
      courseName: "",
      courseType: "",
      courseDescription: "",
      courseObjectives: "",
      choosenCourseType: 0,
      courseStatus: false,
      examStatus: false,
      privateCourse: false,
    })
  }
  clearMessages = () => {
    this.setState({
      courseNameMessage: "",
      courseTypeMessage: "",
      courseDescriptionMessage: "",
      courseObjectivesMessage: "",
      alertMessage: ""
    })
  }
  courseTypeHasChanged = (e) => {
    this.setState({ courseTypeMessage: ""});
    let { value } = e.target;
    this.setState({ choosenCourseType: value });
  }

  handleCourseNameChanged = (e) => {
    this.setState({ courseNameMessage: ""});
    let { value } = e.target;
    this.setState({ courseName: value });
  }

  handleCourseTypeChanged = (e) => {

    let { value } = e.target;
    this.setState({ courseType: value });
  }

  handleDescriptionChange = (e) => {
    this.setState({ courseDescriptionMessage: ""});
    let { value } = e.target;
    this.setState({ courseDescription: value });
  }

  handleCourseObjectivesChanged = (e) => {
    this.setState({ courseObjectivesMessage: ""});
    let { value } = e.target;
    this.setState({ courseObjectives: value });
  }
  handleCourseStatusChanged = (e) => {
    this.state.courseStatus = !this.state.courseStatus
  }
  handleExamStatusChanged = (e) => {
    this.state.examStatus = !this.state.examStatus
  }

  handleCoursePrivacyChanged = (e) => {
    this.state.privateCourse = !this.state.privateCourse
  }

  addcourse = () => {

    const { choosenCourseType, courseName, courseDescription, courseObjectives} = this.state
    this.clearMessages();
    let validated = true;
    if (Validator.isEmpty(courseName) || courseName.length < 3) {
      validated = false;
      this.setState({ courseNameMessage: "Kurs ismi en az üç karakter olmalıdır." });
    }
    if (Validator.isEmpty(courseDescription) || courseDescription.length < 3) {
      validated = false;
      this.setState({ courseDescriptionMessage: "Kurs açıklaması en az üç karakter olmalıdır." });
    }
    if (Validator.isEmpty(courseObjectives) || courseObjectives.length < 6) {
      validated = false;
      this.setState({ courseObjectivesMessage: "Kursun hedefleri en az altı karakter olmalıdır." });
    }
    if(choosenCourseType<1){
      validated=false;
      this.setState({courseTypeMessage:"Lütfen kurs tipi seçiniz."})
    }
    if (validated) {
      axios.post(`http://localhost:3010/course/addcourse`, {

        course_name: this.state.courseName,
        course_desc: this.state.courseDescription,
        course_goals: this.state.courseObjectives,
        course_type: choosenCourseType,
        course_status: this.state.courseStatus,
        course_hasExam: this.state.examStatus,
        course_isPrivate: this.state.privateCourse
      }).then(res => {
        
        this.setState({ modalMessage: this.state.courseName+" isimli kurs başarıyla yaratılmıştır.",modalColor:"blue",modalHeader:"Mesaj",messageModal:true, alertColor: "primary" });
        this.clearForm();
      }).catch(err => {
        this.setState({ modalMessage: "Aynı kurs isminde kurs bulunmaktadır, lütfen başka kurs ismi yazınız.",modalColor:"red",modalHeader:"Hata Mesajı",messageModal:true,alertColor: "danger" })
      });

    }


  }

  render() {
    const {
      isLoaded,
      courseCoordinators,
      error,
      courseTypes,
      currentRoles,
      alertMessage,
      alertColor
    } = this.state;

    const alertStyle = {
      marginTop: "10px"
    };

    const marginTop = {
      marginTop: "20px"
    }

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

        <div style={marginTop}>
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Kurs Yarat
       </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup>
                      <Label for="courseName">Kurs Adı:
            </Label>
                      <Input invalid = {this.state.courseNameMessage} type="text" name="courseName" id="courseName" value={this.state.courseName} onChange={this.handleCourseNameChanged} />
                      <FormText>{this.state.courseNameMessage}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <Label for="courseType">Kurs Tipi</Label>
                      <Input invalid = {this.state.courseTypeMessage} value = {this.state.choosenCourseType} type="select" name="courseType" id="courseTypet" onChange={this.courseTypeHasChanged}>
                        <option value="0">Kurs tipi seçiniz</option>
                        {courseTypes.map(courseType => (<option key={courseType.id} value={courseType.id}>{courseType.type_name}</option>))}
                      </Input>
                      <FormText>{this.state.courseTypeMessage}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <Label for="courseDescription">Kurs Açıklaması:
            </Label>
                      <Input invalid = {this.state.courseDescriptionMessage} type="textarea" name="courseDescription" id="courseDescription" value={this.state.courseDescription} onChange={this.handleDescriptionChange} />
                      <FormText>{this.state.courseDescriptionMessage}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <Label for="courseObjectives">Kursun Hedefleri:
            </Label>
                      <Input invalid = {this.state.courseObjectivesMessage} type="textarea" name="courseObjectives" id="courseObjectives" value={this.state.courseObjectives} onChange={this.handleCourseObjectivesChanged} />
                      <FormText>{this.state.courseObjectivesMessage}</FormText>
                    </FormGroup>
                    <div>
                      <label>
                        <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={this.handleCourseStatusChanged} checked={this.state.courseStatus} />{' '}
                        <span>Kurs hemen aktif olsun.</span>
                      </label>
                      <br />
                      <label>

                        <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={this.handleExamStatusChanged} checked={this.state.examStatus} />{' '}
                        <span>Kursun sınavı var.</span>
                      </label>
                      <br />
                      <label>
                        <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={this.handleCoursePrivacyChanged} checked={this.state.privateCourse} />{' '}
                        <span>Kullanıcılar kursa yönetici tarafından  eklenecek.</span>
                      </label>
                      <br />
                    </div>


                    <FormGroup style={alertStyle}>
                      <Button color="primary" onClick={this.addcourse}>Kurs Yarat</Button>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {alert}

          <Modal isOpen={this.state.messageModal} toggle={this.closeModal}>
                    <ModalHeader style={{ backgroundColor:this.state.modalColor, color: "white" }} toggle={this.closeModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.modalColor, color: "white" }} onClick={this.closeModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

        </div>
      );
    }
  }
}

export default CreateCourseComponent;
