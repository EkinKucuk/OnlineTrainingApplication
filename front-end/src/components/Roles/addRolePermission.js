import React, { Component } from 'react'
import {
  Button, Spinner, FormGroup,
  Input, Container,
  Label, Form, ListGroup, ListGroupItem, Alert, Badge, Card, CardBody, CardHeader, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter
} from 'reactstrap';
import axios from 'axios';

class AddRolePermissionComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      permissions: [],
      roles: [],
      chosenPermission: 0,
      chosenRole: 0,
      areYouSureModal: false,
      permissionModal:false,
      modalMessage:"",
      modalHeader:"",
      modalColor:"",
      chosenPermissionIdd: "",
      chosenPermissionNamee: "",
      currentPermissions: [],
      alertMessage: "",
      alertColor: "primary"
    }
  }
  //ViewDidload
  componentDidMount = () => {


    axios.get('http://localhost:3010/roles/getpermissions')
      .then(res => {
        const permissions = res.data;
        this.setState({ permissions: permissions, isLoaded: true });
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

  closeAreYouSureModal = () => {
    this.setState({ areYouSureModal: false });
  }
  closePermissionModal=()=>{
    this.setState({permissionModal:false});
  }
  getRolePermissions = (chosenRole) => {
    axios.get('http://localhost:3010/roles/getrolepermissions', {
      params: {
        role_id: chosenRole
      }

    })
      .then(res => {
        const currentPermissions = res.data;
        console.log(currentPermissions);
        this.setState({ currentPermissions: currentPermissions });
      })
      .catch(err => {
        this.setState({ error: err, isLoaded: true })
      });
  }

  handlePermissionChange = (e) => {
    this.setState({ alertMessage: "" });
    let { value } = e.target;
    this.setState({ chosenPermission: value });
  }



  handleRoleChange = (e) => {
    this.setState({ alertMessage: "" });
    let { value } = e.target;
    this.setState({ chosenRole: value });

    if (value !== 0) {
      this.getRolePermissions(value);
    }
    else {
      this.setState({ currentPermissions: [] });
    }
  }

  toggleDeleterolePermission = (permission) => {
    this.setState({
      areYouSureModal: true,
      chosenPermissionIdd: permission.id,
      chosenPermissionNamee: permission.permission_name
    });
  }

  deleteRolePermission = (permission_id) => {

    this.setState({ alertMessage: "" });
    const { chosenRole } = this.state;

    axios.delete(`http://localhost:3010/roles/deleterolepermission`, {
      data: {
        permission_id: parseInt(permission_id),
        role_id: parseInt(chosenRole)
      }

    })
      .then(res => {
        this.closeAreYouSureModal();
        this.setState({ modalMessage: "Yetki rolden başarıyla silinmiştir. Kullanıcıların tekrar giriş yapmasıyla etki bulacaktır.", modalColor:"blue",modalHeader:"Mesaj",permissionModal:true,alertColor: "primary" });
        this.getRolePermissions(chosenRole);

      })
      .catch(err => {
        this.closeAreYouSureModal();
        this.setState({ modalMessage: "Yetki rolden silinirken bir problem yaşanmıştır.", modalHeader:"Hata Mesajı",modalColor:"red",permissionModal:true,alertColor: "danger" })
      });
  }

  addRolePermission = () => {

    const { chosenRole, chosenPermission } = this.state;
    this.setState({ alertMessage: "" });

    axios.post(`http://localhost:3010/roles/addrolepermission`, {
      role_id: parseInt(chosenRole),
      permission_id: parseInt(chosenPermission)
    })
      .then(res => {
        this.setState({ modalMessage: "Yetki başarıyla role atanmıştır.", modalColor:"blue",modalHeader:"Mesaj",permissionModal:true,alertColor: "primary" });
        this.getRolePermissions(chosenRole);

      })
      .catch(err => {
        this.setState({ modalMessage: "Yetki atanırken problem yaşanmıştır.", modalColor:"red",modalHeader:"Hata Mesajı",permissionModal:true,alertColor: "danger" })
      });
  }

  render() {

    const { isLoaded, permissions, error, roles, currentPermissions, alertMessage, alertColor, chosenRole, } = this.state;

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

      let currentPermissionsList
      if (chosenRole === 0) {
        currentPermissionsList = (

          <Alert color="warning">
            Rolün yetki bilgilerine ulaşmak için önce rol seçiniz.
          </Alert>
        )
      }
      else if (chosenRole > 0 && currentPermissions.length === 0) {
        currentPermissionsList = (

          <Alert color="warning">
            Rolün mevcut yetkileri bulunmamaktadır.
          </Alert>
        )
      }
      else if (currentPermissions.length > 0) {
        currentPermissionsList = (
          <ListGroup>
            {
              currentPermissions.map(currentPermission => (
                <ListGroupItem key={currentPermission.id} value={currentPermission.id} className="justify-content-between">{currentPermission.permission_name} <Badge onClick={() => this.toggleDeleterolePermission(currentPermission)} pill>X</Badge></ListGroupItem>
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
                  <i className="fa fa-align-justify"></i> Rol'e Yetki Atama
              </CardHeader>
                <CardBody>

                  <Form>
                    <FormGroup>
                      <Label for="roleSelect">Rol Seçin</Label>
                      <Input type="select" name="select" id="roleSelect" onChange={this.handleRoleChange}>
                        <option value="0">Rol Seçin</option>
                        {roles.map(roles => (
                          <option key={roles.id} value={roles.id}>{roles.role_name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleSelectMulti">Rolün Mevcut Yetkileri</Label>
                      {currentPermissionsList}
                    </FormGroup>

                    <FormGroup>
                      <Label for="roleSelect">Yetki Seçin</Label>
                      <Input type="select" name="select" id="roleSelect" onChange={this.handlePermissionChange}>
                        <option value="0">Yetki Seçin</option>
                        {permissions.map(permission => (
                          <option key={permission.id} value={permission.id}>{permission.permission_name}</option>
                        ))}
                      </Input>
                    </FormGroup>

                    <Button color="primary" onClick={this.addRolePermission}>Yetki Ekle</Button>
                  </Form>
                  {alert}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal isOpen={this.state.permissionModal} toggle={this.closePermissionModal}>
                    <ModalHeader style={{ backgroundColor: this.state.modalColor, color: "white" }} toggle={this.closePermissionModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.modalColor, color: "white" }} onClick={this.closePermissionModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

          <Modal isOpen={this.state.areYouSureModal} toggle={this.closeAreYouSureModal}>
            <ModalHeader toggle={this.closeAreYouSureModal}>Yetki Silme Onayı</ModalHeader>
            <ModalBody>
              <p> <strong>{this.state.chosenPermissionNamee} </strong> yektisini silmek istediğinizden emin misiniz?</p>

            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => this.deleteRolePermission(this.state.chosenPermissionIdd)}>Sil</Button>
              <Button color="primary" onClick={this.closeAreYouSureModal}>Kapat</Button>
            </ModalFooter>
          </Modal>


        </div>
      );

    }


  }

}


export default AddRolePermissionComponent;