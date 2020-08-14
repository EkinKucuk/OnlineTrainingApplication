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
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,

} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator'
import { AppSwitch } from '@coreui/react'
class CreateCourseModuleComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            alertMessage: "",
            courseId: "",
            moduleName: "",
            moduleType: 0,
            moduleTypeChosen: true,
            moduleDesc: "",
            downloadable: false,
            file: null
        }
    }
    componentDidMount = () => {
        this.setState({ isLoaded: true })
    }

    clearMessages = () => {
        this.setState({
            moduleNameMessage: "",
            moduleDescMessage: "",
            moduleFileMessage: "",
            moduleTypeMessage: "",
            alertMessage: ""
        })
    }

    clearForm = () => {
        this.setState({
            moduleName: "",
            moduleDesc: "",
            file: null,
            moduleType: 0,
            downloadable: false
        })
    }
    handleDownloadableChange = () => {
        this.setState({ downloadable: !this.state.downloadable })
    }
    handleOnDrop = (e) => {
this.setState({moduleFileMessage:""});
        const file = e.target.files[0];

        if (this.state.moduleType === "1") {

            if (file.type === "video/mp4") {
                this.setState({ file: file }, () => {
                    console.log(this.state.file);
                });
            }
            else {
                this.setState({ moduleFileMessage: "Lütfen MP4 tipinde dosya yükleyiniz." })
            }

        } else if (this.state.moduleType === "2") {
            if (file.type === "application/pdf") {

                this.setState({ file: file }, () => {
                    console.log(this.state.file);
                });
            } else {
                this.setState({ moduleFileMessage: "Lütfen PDF tipinde dosya yükleyiniz." })
            }

        } else {
            this.setState({ moduleFileMessage: "Lütfen döküman tipi seçiniz." });
        }

    }
    handleModuleNameChanged = (e) => {
        this.setState({ moduleNameMessage: "" });
        let { value } = e.target;
        this.setState({ moduleName: value });
    }
    handleModuleDescChanged = (e) => {
        this.setState({ moduleDescMessage: "" });
        let { value } = e.target;
        this.setState({ moduleDesc: value });
    }
    handleMoudleTypeChanged = (e) => {
        this.setState({ moduleTypeMessage: "" });
        let { value } = e.target;
        console.log(value);
        if (value == 0) {
            console.log('asdasdasd');
            this.setState({ moduleType: value, moduleTypeChosen: true })
        }
        else {
            this.setState({ moduleType: value, moduleTypeChosen: false })
        }

    }
    addCourseModule = () => {


        this.clearMessages();

        const { moduleType, moduleName, moduleDesc, file, downloadable } = this.state;
        let validated = true;
        if (moduleName.length < 3) {
            validated = false;
            this.setState({ moduleNameMessage: "Modül ismi en az 3 karakter olmalıdır." })
        }

        if (moduleDesc.length < 3) {
            validated = false;
            this.setState({ moduleDescMessage: "Modül açıklaması en az 3 karakter olmalıdır." })
        }

        if (moduleType === 0) {
            validated = false;
            this.setState({ moduleTypeMessage: "Lütfen dosya tipini seçiniz." })
        }
        if (!file) {
            validated = false;
            this.setState({ moduleFileMessage: "Lütfen dosya yükleyiniz." })
        }


        if (validated) {
            let data = new FormData();
            data.append('file', file, file.name);
            data.append('module_typeid', moduleType);
            data.append('module_name', moduleName);
            data.append('module_desc', moduleDesc);
            data.append('course_id', this.props.course_id)
            data.append('is_downloadable', downloadable)

            axios.post(`http://localhost:3010/module/createmodule`,

                data

            ).then(res => {
                this.setState({  modalMessage:"Modül başarıyla yaratılmıştır.", modalHeader:"Mesaj", messageModalColor:"blue",messageModal:true });
                this.clearForm();

            }).catch(err => {
                this.setState({ modalMessage:"Modül yaratılırken problem oluşmuştur. Lütfen sistem yetkililerine ulaşın veya tekrar deneyin.", modalHeader:"Hata Mesajı", messageModalColor:"red",messageModal:true })
            });
        }

    }

    closeMessageModal=()=>{
        this.setState({messageModal:false});
    }
    render() {

        const {
            isLoaded,
            error,
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

            return (<div>
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                Modül Yaratma
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="courseName">Modül Adı:   </Label>
                                        <Input invalid={this.state.moduleNameMessage} type="text" name="moduleName" id="moduleName" value={this.state.moduleName} onChange={this.handleModuleNameChanged} />
                                        <FormText>{this.state.moduleNameMessage}</FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">Modül Açıklaması: </Label>
                                        <Input invalid={this.state.moduleDescMessage} type="textarea" name="moduleDesc" id="moduleDesc" value={this.state.moduleDesc} onChange={this.handleModuleDescChanged} />
                                        <FormText>{this.state.moduleDescMessage}</FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="courseType">Döküman Tipi:</Label>
                                        <Input invalid={this.state.moduleTypeMessage} type="select" name="moduleType" id="moduleType" value={this.state.moduleType} onChange={this.handleMoudleTypeChanged}>
                                            <option value="0">Döküman tipi seçiniz</option>
                                            <option value="1">Video</option>
                                            <option value="2">PDF</option>
                                        </Input>
                                        <FormText>{this.state.moduleTypeMessage}</FormText>
                                    </FormGroup>
                                    <label>

                                        <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={this.handleDownloadableChange} checked={this.state.downloadable} />{' '}
                                        <span>Dosya indirilebilir.</span>
                                    </label>
                                    <FormGroup>
                                        <Label for="exampleFile">Dosya:</Label>
                                        <Input disabled={this.state.moduleTypeChosen} type="file" name="file" onChange={this.handleOnDrop} />
                                        <FormText>{this.state.moduleFileMessage}</FormText>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button color="primary" onClick={this.addCourseModule}>Modül Ekle</Button>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                
                <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style = {{backgroundColor: this.state.messageModalColor, color: "white"}} toggle={this.closeMessageModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style = {{backgroundColor: this.state.messageModalColor, color: "white"}} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

            </div>);
        }

    }

}
export default CreateCourseModuleComponent;