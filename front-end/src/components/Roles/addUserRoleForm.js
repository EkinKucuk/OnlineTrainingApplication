import React, { Component } from 'react'
import {
  Button, Spinner, FormGroup,
  Input, Container,
  Label, Form, ListGroup, ListGroupItem, Alert, Badge, Card, CardBody, CardHeader, Row, Col,Modal,ModalBody,ModalFooter,ModalHeader
} from 'reactstrap';
import axios from 'axios';

class RoleFormComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      users: [],
      roles: [],
      chosenUser: 0,
      chosenRole: 0,
      currentRoles: [],
      alertMessage: "",
      alertColor: "primary",
      chosenRoleName: "",
      chosenRoleIdd: "",
      areYouSureModal:false,
      roleModal:false,
      modalMessage:"",
      modalHeader:"",
      modalColor:""
    }
  }
  //ViewDidload
  componentDidMount = () => {


    axios.get('http://localhost:3010/users/')
      .then(res => {
        const users = res.data;
        this.setState({ users: users, isLoaded: true });
      })
      .catch(err => {
        this.setState({ error: err, isLoaded: true })
      });

    axios.get('http://localhost:3010/roles')
      .then(res => {
        const roles = res.data;
        this.setState({ roles: roles, isLoaded: true });
      })
      .catch(err => {
        this.setState({ error: err, isLoaded: true })
      });



  }
  closeRoleModal=()=>{
    this.setState({roleModal:false});
  }
  closeAreYouSureModal = () => {
    this.setState({ areYouSureModal: false });
}

  getUserRoles = (userId) => {
    axios.get('http://localhost:3010/roles/getrolesbyuserid', {
      params: {
        user_id: parseInt(userId)
      }

    })
      .then(res => {
        const currentRoles = res.data;
        this.setState({ currentRoles: currentRoles });
      })
      .catch(err => {
        this.setState({ error: err, isLoaded: true })
      });
  }

  handleUserChange = (e) => {
    this.setState({ alertMessage: "" });
    let { value } = e.target;
    this.setState({ chosenUser: value })

    if (value !== 0) {
      this.getUserRoles(value);
    }
    else {
      this.setState({ currentRoles: [] });
    }

  }



  handleRoleChange = (e) => {
    this.setState({ alertMessage: "" });
    let { value } = e.target;
    this.setState({ chosenRole: value });
  }

  toggleDeleteUserRole = (role) => {
    this.setState({
      areYouSureModal: true,
      chosenRoleName:role.role_name,
      chosenRoleIdd:role.id

    });
  }

  deleteUserRole = (role_id) => {

    this.setState({ alertMessage: "" });
    const { chosenUser } = this.state;

    axios.delete(`http://localhost:3010/roles/deleteuserrole`, {
      data: {
        role_id: parseInt(role_id),
        user_id: parseInt(chosenUser)
      }

    })
      .then(res => {
        this.closeAreYouSureModal();
        this.setState({ modalMessage: "Rol başarıyla kullanıcıdan silinmiştir",modalColor:"blue",modalHeader:"Mesaj",roleModal:true, alertColor: "primary" });
        this.getUserRoles(chosenUser);

      })
      .catch(err => {
        this.closeAreYouSureModal();
        this.setState({ modalMessage: "Rol kullanıcıdan silinirken problem yaşanmıştır.",modalColor:"red",modalHeader:"Hata Mesajı",roleModal:true, alertColor: "danger" })
      });
  }

  addUserRole = () => {

    const { chosenRole, chosenUser } = this.state;
    this.setState({ alertMessage: "" });

    axios.post(`http://localhost:3010/roles/adduserrole`, {
      role_id: parseInt(chosenRole),
      user_id: parseInt(chosenUser)
    })
      .then(res => {
        this.setState({ modalMessage: "Rol başarıyla kullanıcıya atanmıştır.",modalHeader:"Mesaj",modalColor:"blue",roleModal:true, alertColor: "primary" });
        this.getUserRoles(chosenUser);

      })
      .catch(err => {
        this.setState({ modalMessage: "Rol atanırken problem yaşanmıştır.", modalHeader:"Hata Mesajı",modalColor:"red",roleModal:true,alertColor: "danger" })
      });
  }

  render() {

    const { isLoaded, users, error, roles, currentRoles, alertMessage, alertColor, chosenUser } = this.state;

    const alertStyle = {
      marginTop: "10px"
    };

    if (isLoaded === false) {
      return (<div>

        <Spinner color="primary" />
      </div>
      )
    }
    else if (error) {
      return (
        <div>

          <p>Verilere ulaşmaya çalışırken hata oluşmuştur.</p>
        </div>
      )

    }
    else {

      let alert;
      if (alertMessage !== "") {
        alert = (
          <div style={alertStyle}>
            <Alert color={alertColor}>
              {alertMessage}
            </Alert>
          </div>
        )
      }

      let currentRolesList
      if (chosenUser === 0) {
        currentRolesList = (

          <Alert color="warning">
            Rol bilgilerine ulaşmak için önce kullanıcı seçiniz.
          </Alert>
        )
      }
      else if (chosenUser > 0 && currentRoles.length === 0) {
        currentRolesList = (

          <Alert color="warning">
            Kullanıcın mevcut rolleri bulunmamaktadır.
          </Alert>
        )
      }
      else if (currentRoles.length > 0) {
        currentRolesList = (
          <ListGroup>
            {
              currentRoles.map(currentRole => (
                <ListGroupItem key={currentRole.id} value={currentRole.id} className="justify-content-between">{currentRole.role_name} <Badge onClick={() => this.toggleDeleteUserRole(currentRole)} pill>X</Badge></ListGroupItem>
              ))
            }
          </ListGroup>



        )
      }

      return (
        <div>

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Kullanıcıya Rol Atama
              </CardHeader>
                <CardBody>

                  <Form>
                    <FormGroup>
                      <Label for="userSelect">Kullanıcı Seçin</Label>
                      <Input type="select" name="select" id="userSelect" onChange={this.handleUserChange}>
                        <option value="0">Kullanıcı Seçin</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleSelectMulti">Kullanıcının Mevcut Rolleri</Label>
                      {currentRolesList}
                    </FormGroup>

                    <FormGroup>
                      <Label for="roleSelect">Rol Seçin</Label>
                      <Input type="select" name="select" id="roleSelect" onChange={this.handleRoleChange}>
                        <option value="0">Rol Seçin</option>
                        {roles.map(roles => (
                          <option key={roles.id} value={roles.id}>{roles.role_name}</option>
                        ))}
                      </Input>
                    </FormGroup>

                    <Button color="primary"onClick={this.addUserRole}>Rol Ekle</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {alert}
          <Modal isOpen={this.state.roleModal} toggle={this.closeRoleModal}>
                    <ModalHeader style={{ backgroundColor: this.state.modalColor, color: "white" }} toggle={this.closeRoleModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.modalColor, color: "white" }} onClick={this.closeRoleModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>
          <Modal isOpen={this.state.areYouSureModal} toggle={this.closeAreYouSureModal}>
            <ModalHeader toggle={this.closeAreYouSureModal}>Rol Silme Onayı</ModalHeader>

            <ModalBody>
              <p> <strong>{this.state.chosenRoleName} </strong> rolünü silmek istediğinizden emin misiniz?</p>

            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => this.deleteUserRole(this.state.chosenRoleIdd)}>Sil</Button>
              <Button color="primary" onClick={this.closeAreYouSureModal}>Kapat</Button>
            </ModalFooter>
          </Modal>


        </div>
      );

    }


  }

}


export default RoleFormComponent;