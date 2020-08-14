import React, { Component } from 'react'
import {
  Button,
  FormGroup,
  Input,
  Label,
  Form,
  Card,
  CardBody,
  CardHeader,
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Alert
} from 'reactstrap';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';

class AddUserToACourseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      modalAddUser: false,
      modalAcceptEnroll: false,
      modalDenyEnroll: false,
      areYouSureModal:false,
      messageModal:false,
      messageModalMessage:"",
      messageModalColor:"",
      messageModalHeader:"",
      chosenUserID:"",
      chosenCourseID:"",
      chosenUserName:"",
      modalmessage: "",
      userRoles: [],
      courseUsers: [],
      users: [],
      chosenRole: 0,
      alertMessage: "",
      alertColor: "",
      enrollRequestedUsers: []
    }
  }
  componentDidMount = () => {
    const course = this.props.course;
    this.getUsersForCourse(course.id);
    this.getCourseUsers(course.id);
    this.getEnrollRequests(course.id);
  }

  toggleDeleteUserFromACourse=(user,course_id)=>{
    this.setState({
      areYouSureModal:true,
      chosenUserName:user.first_name,
      chosenCourseID:course_id,
      chosenUserID: user.id
    })
  }
  deleteUserFromACourse = (user_id, course_id) => {

    console.log(user_id);
    console.log(course_id);
    axios.delete('http://localhost:3010/course/deletecourseuser', {
      data: {
        course_id: course_id,
        user_id: user_id
      }
    })
      .then(res => {
        this.closeAreYouSureModal();
        this.setState({ messageModalMessage: "Kullanıcı başarıyla kurstan silinmiştir.", messageModalColor:"blue",messageModalHeader:"Mesaj",messageModal:true,alertColor: "primary" });
        this.getCourseUsers(course_id);
        this.getUsersForCourse(course_id);
      })
      .catch(err => {
        this.closeAreYouSureModal();
        this.setState({ error: err })
        this.setState({ messageModalMessage: "Kullanıcı silinirken bir problem yaşanmıştır.",  messageModalColor:"red",messageModalHeader:"Hata Mesajı",messageModal:true,alertColor: "danger" })
      });
  }

  getUsersForCourse = (course_id) => {


    axios.get('http://localhost:3010/course/getusersforcourse', {
      params: {
        course_id: course_id
      }
    })
      .then(res => {
        const users = res.data;
        console.log(users);
        this.setState({ users: users });
      })
      .catch(err => {
        this.setState({ error: err })
      });
  }
closeAreYouSureModal=()=>{
  this.setState({areYouSureModal:false});
}
closeMessageModal=()=>{
  this.setState({messageModal:false});
}
closeAreYouSureDenyModal=()=>{
  this.setState({areYouSureDenyModal:false});
}
  getEnrollRequests = (course_id) => {


    axios.get('http://localhost:3010/course/getenrollrequests', {
      params: {
        course_id: course_id
      }
    })
      .then(res => {
        const users = res.data;
        console.log(users);
        this.setState({ enrollRequestedUsers: users });
      })
      .catch(err => {
        this.setState({ error: err })
      });
  }


  getCourseUsers = (course_id) => {

    axios.get('http://localhost:3010/course/getcourseusers', {
      params: {
        course_id: course_id
      }
    })
      .then(res => {
        const users = res.data;
        console.log(users);
        this.setState({ courseUsers: users });
      })
      .catch(err => {
        this.setState({ error: err })
      });
  }

  handleRoleChange = (e) => {
    this.setState({ alertMessage: "" });
    let { value } = e.target;
    this.setState({ chosenRole: value });
  }

  addUserToACourse = () => {


    if (this.state.chosenRole < 1) {
      this.setState({ modalMessage: "Lütfen rol seçiniz." })
    }
    else {
      const course_id = this.state.chosenCourse;
      axios.post(`http://localhost:3010/course/addcourseuser`, {
        course_id: course_id,
        user_id: this.state.chosenUser,
        role_id: this.state.chosenRole
      }).then(res => {
        this.getCourseUsers(course_id);
        this.getUsersForCourse(course_id);
        this.setState({modalAddUser: false, messageModalMessage: "Kullanıcı kursa atanmıştır.", messageModalColor:"blue",messageModalHeader:"Mesaj", alertColor: "primary", modalMessage: "" ,messageModal:true});

      }).catch(err => {
        this.setState({ modalMessage: "Hata oluşmuştur." })
      });
    }


  }

  getUserRoles = (user_id) => {

    console.log(user_id);
    axios.get('http://localhost:3010/roles/getrolesbyuserid', {
      params: {
        user_id: user_id
      }
    })
      .then(res => {
        const roles = res.data;
        this.setState({ userRoles: roles });
      })
      .catch(err => {
        this.setState({ error: err })
      });
  }

  closeAddUserModal = () => {
    this.setState({
      modalAddUser: false,
      modalMessage: ""
    });

  }

  closeAcceptEnroll = () => {
    this.setState({
      modalAcceptEnroll: false,
      modalMessage: ""
    });

  }

  closeDenyEnroll = () => {
    this.setState({
      closeAddUserModal: false,
      modalDenyEnroll: ""
    });
  }

  addUserToACourseModal = (user_id, course_id) => {

    this.setState({ chosenCourse: course_id, chosenUser: user_id, modalAddUser: true })
    this.getUserRoles(user_id);

  }

  acceptEnrollRequestModal = (user_id, course_id) => {
    this.setState({ chosenCourse: course_id, chosenUser: user_id, modalAcceptEnroll: true })
    this.getUserRoles(user_id);
  }

  denyEnrollRequestModal = (user_id, course_id) => {
    this.setState({ chosenCourse: course_id, chosenUser: user_id, modalDenyEnroll: true })
  }

  acceptEnrollRequest = () => {
    axios.post(`http://localhost:3010/course/acceptenrollrequest`, {
      course_id: this.state.chosenCourse,
      user_id: this.state.chosenUser,
      role_id: this.state.chosenRole
    }).then(res => {
      this.getCourseUsers(this.state.chosenCourse);
      this.getUsersForCourse(this.state.chosenCourse);
      this.getEnrollRequests(this.state.chosenCourse);
      this.setState({ modalAcceptEnroll: false,messageModalMessage: "Kullanıcı kursa atanmıştır.", messageModalColor:"blue",messageModalHeader:"Mesaj",alertColor: "primary",messageModal:true,modalMessage: "" });

    }).catch(err => {
      this.setState({ modalMessage: "Hata oluşmuştur." })
    });
  }

  denyEnrollRequest = () => {
    axios.post(`http://localhost:3010/course/denyenrollrequest`, {
      course_id: this.state.chosenCourse,
      user_id: this.state.chosenUser,
    }).then(res => {
      this.getEnrollRequests(this.state.chosenCourse);
      this.setState({ modalDenyEnroll: false,messageModalMessage: "Kullanıcının eklenmesi reddedilmiştir.", messageModalColor:"blue",messageModalHeader:"Mesaj",messageModal:true,alertColor: "primary",  modalMessage: "" });

    }).catch(err => {
      this.setState({ modalMessage: "Hata oluşmuştur." })
    });
  }

  render() {

    const course = this.props.course;
    const { modalMessage, alertMessage, alertColor, } = this.state;

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

    let roleModal;

    if (this.state.userRoles.length === 0) {
      roleModal = (
        <p>Kullanıcıya atanmış bir rol bulunmamaktadır. Lütfen önce kullanıcıya rol ekleyeniz.</p>
      )
    }
    else {
      roleModal = (
        <div>
          <Label for="roleSelect">Rol Seçin</Label>
          <Input type="select" name="select" id="roleSelect" onChange={this.handleRoleChange}>
            <option value="0">Rol Seçin</option>
            {this.state.userRoles.map(role => (
              <option key={role.id} value={role.id}>{role.role_name}</option>
            ))}
          </Input>
        </div>
      );
    }

    let enrollRequestedUsersTable;
    if(this.state.enrollRequestedUsers.length > 0){

      const enrollData = (
            
        this.state.enrollRequestedUsers.map((user) =>(
            {
              first_name: user.first_name,
              last_name: user.last_name,
              add: <Button color="primary" onClick={() => this.acceptEnrollRequestModal(user.id, course.id)}>Ekle</Button>,
              delete: <Button color="danger" onClick={() => this.denyEnrollRequestModal(user.id, course.id)}>Reddet</Button>
            }
          ))
      )
  
      const enrollTable = {
        columns: [
          {
            label: 'İsim',
            field: 'first_name',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Soyisim',
            field: 'last_name',
            sort: 'asc',
            width: 200
          },
          {
            label: '',
            field: 'add',
            sort: 'asc',
            width: 200
          },
          {
            label: '',
            field: 'delete',
            sort: 'asc',
            width: 50
          },
  
        ],
        rows: enrollData
    };
        enrollRequestedUsersTable = (
          
          <MDBDataTable
                            striped
                            bordered
                            large
                            data={enrollTable}
                        />

        )
    }
    else {
      enrollRequestedUsersTable = (
        <p>Mevcut katılım isteği bulunmamaktadır.</p>
      )
    }

    let usersList;

    if(this.state.courseUsers.length > 0) {

      const courseUsersTableData = (
            
        this.state.courseUsers.map((user) =>(
            {
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role_name,
              delete: <Button color="danger" onClick={() => this.toggleDeleteUserFromACourse(user,course.id)}>Sil</Button>
            }
          ))
      )
  
      const courseUsersTable = {
        columns: [
          {
            label: 'İsim',
            field: 'first_name',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Soyisim',
            field: 'last_name',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Kullanıcı Rolü',
            field: 'role',
            sort: 'asc',
            width: 200
          },
          {
            label: '',
            field: 'delete',
            sort: 'asc',
            width: 50
          },
  
        ],
        rows: courseUsersTableData
    };

      usersList = (
        <MDBDataTable
                            striped
                            bordered
                            large
                            data={courseUsersTable}
                        />
      )
    }
    else {
      usersList = (
        <p>Kursa eklenmiş kullanıcı yoktur.</p>
      )
    }

    const tableData = (
            
      this.state.users.map((user) =>(
          {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            add_button: <Button color="primary" onClick={() => this.addUserToACourseModal(user.id, course.id)}>Kullanıcıyı Eğitime Ekle</Button>
          }
        ))
    )

    const table = {
      columns: [
        {
          label: 'İsim',
          field: 'first_name',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Soyisim',
          field: 'last_name',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
          width: 200
        },
        {
          label: '',
          field: 'add_button',
          sort: 'asc',
          width: 50
        },

      ],
      rows: tableData
  };


    return (
      <div>

        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Kurs Bilgileri
                    </CardHeader>
          <CardBody>
            <Table>
              <thead>
                <tr>
                  <th>Kurs Adı</th>
                  <th>Kurs Açıklaması</th>
                  <th>Kurs Tipi</th>
                </tr>
              </thead>
              <tbody>
                <tr key={course.id}>
                  <td>{course.course_name}</td>
                  <td>{course.course_desc}</td>
                  <td>{course.type_name}</td>
                </tr>
              </tbody>
            </Table>



          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Kursta Bulunan Mevcut Kullanıcılar
                      </CardHeader>
          <CardBody>
            
              {usersList}

          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Kursa Katılmak İsteyen Kullanıcılar
                      </CardHeader>
          <CardBody>
           
                {enrollRequestedUsersTable}

          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Kullanıcı Bilgileri
                      </CardHeader>
          <CardBody>
          <MDBDataTable
                            striped
                            bordered
                            large
                            data={table}
                        />

            {alert}
          </CardBody>
        </Card>



        <Modal isOpen={this.state.modalAddUser}>
          <ModalHeader>Kursu Düzenle</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                {roleModal}
              </FormGroup>



            </Form>
            <p>{modalMessage}</p>
          </ModalBody>
          
          <ModalFooter>
            <Button color="primary" onClick={this.addUserToACourse}>Kullanıcıyı Ekle</Button>
            <Button color="Danger" onClick={this.closeAddUserModal}>Kapat</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalAcceptEnroll}>
          <ModalHeader>Kullanıcıyı Onayla</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                {roleModal}
              </FormGroup>



            </Form>
            <p>{modalMessage}</p>
          </ModalBody>
          
          <ModalFooter>
            <Button color="primary" onClick={this.acceptEnrollRequest}>Kullanıcıyı Ekle</Button>
            <Button color="Danger" onClick={this.closeAcceptEnroll}>Kapat</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalDenyEnroll}>
          <ModalHeader>Kullanıcıyı Reddet</ModalHeader>
          <ModalBody>
              Lütfen kullanıcıyı reddetmeyi onaylayınız.
          <p>{modalMessage}</p>
          </ModalBody>
          
          <ModalFooter>
            <Button color="primary" onClick={this.denyEnrollRequest}>Kullanıcıyı Reddet</Button>
            <Button color="Danger" onClick={this.closeDenyEnroll}>Kapat</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style={{ backgroundColor:this.state.messageModalColor, color: "white" }} toggle={this.closeMessageModal}>{this.state.messageModalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.messageModalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.messageModalColor, color: "white" }} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

        <Modal isOpen={this.state.areYouSureModal} toggle={this.closeAreYouSureModal}>
                    <ModalHeader toggle={this.closeAreYouSureModal}>Kullanıcı Silme Onayı</ModalHeader>

                    <ModalBody>
                        <p> <strong>{this.state.chosenUserName}</strong> isimli kullanıcıyı kurstan çıkartmak istediğinizden emin misiniz?</p>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.deleteUserFromACourse(this.state.chosenUserID, this.state.chosenCourseID)}>Çıkart</Button>
                        <Button color="primary" onClick={this.closeAreYouSureModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>
                   
      </div>

    );
  }


}

export default AddUserToACourseComponent;
