import React, { Component } from 'react'
import {
    Button, Alert, Form, FormGroup, Label, Input, FormText,
    CardHeader, Card, CardBody, Table, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import axios from 'axios';
import Validator from 'validator';
import { AppSwitch } from '@coreui/react'
import { MDBDataTable } from 'mdbreact';
class ModuleOperations extends Component {


    constructor(props) {
        super(props);

        this.state = {

            error: null,
            progress: "",
            isLoaded: false,
            courseName: "",
            courseModules: [],
            filePath: "",
            selectedModule: [],
            modal: false,
            alertMessage: "",
            updateModuleModal: false,
            updateModuleFileModal: false,
            oldModuleName: "",
            oldModuleDesc: "",
            oldIsDownloadable: null,
            moduleTypeChosen: true,
            moduleType: 0,
            file: null,
            modalHeader: "",
            modalMessage: "",
            messageModal: false,
            messageModalColor: "",

        }
    }

    getCourseModules = () => {


        axios.get('http://localhost:3010/authcommon/getmodules', {
            params: {
                course_id: this.props.course_id
            }
        }).then(res => {
            const courseModules = res.data.rows;
            console.log(courseModules);
            this.setState({ courseModules: courseModules, isLoaded: true });
        })
            .catch(err => {
                this.setState({ error: err, isLoaded: true })
            });
    }

    deleteModule = (module_id) => {
        this.clearMessages();
        axios.delete('http://localhost:3010/module/deletemodule', {
            data: {
                module_id: module_id
            }
        })
            .then(res => {
                this.getCourseModules();
                this.setState({ modalMessage: "Modül başarıyla silinmiştir.", modalHeader: "Mesaj", messageModalColor: "blue", messageModal: true, modal: false });
            })
            .catch(err => {
                this.setState({ error: err })
                this.setState({ modalMessage: "Modül silinirken problem yaşanmıştır.", modalHeader: "Hata Mesajı", messageModalColor: "red", messageModal: true, modal: false })
            });
    }

    componentDidMount = () => {
        this.getCourseModules();
    }

    clearMessages = () => {
        this.setState({
            updateModalMessage: "",
            moduleNameMessage: "",
            moduleDescMessage: "",
            alertMessage: "",
            alertColor: "",
            moduleTypeMessage: "",
            moduleFileMessage: "",
            modalHeader: "",
            modalMessage: "",
            messageModal: false,
            messageModalColor: "",
        })
    }

    toggleModuleDeleteModal = (courseModule) => {
        this.setState({ selectedModule: courseModule, modal: true })
    }
    toggleUpdateModal = (courseModule) => {
        this.clearMessages();
        console.log(courseModule);
        const { module_name, module_desc, is_downloadable } = courseModule;
        this.setState({ selectedModule: courseModule, updateModuleModal: true, oldModuleName: module_name, oldModuleDesc: module_desc, oldIsDownloadable: is_downloadable })
    }

    toggleFileUpdateModal = (courseModule) => {
        this.clearMessages();

        this.setState({ selectedModule: courseModule, updateModuleFileModal: true })
    }

    closeModal = () => {
        this.setState({ modal: false });
    }
    closeUpdateModal = () => {
        this.setState({ updateModuleModal: false })
    }
    closeUpdateFileModal = () => {
        this.setState({ updateModuleFileModal: false })
    }

    handleModuleNameChanged = (e) => {
        let { value } = e.target;
        this.setState({
            selectedModule: Object.assign({}, this.state.selectedModule, {
                module_name: value,
            }),
            moduleNameMessage: ""
        });
    }
    handleModuleDescChanged = (e) => {
        let { value } = e.target;
        this.setState({
            selectedModule: Object.assign({}, this.state.selectedModule, {
                module_desc: value,
            }),
            moduleDescMessage: ""
        });
    }

    handleDownloadableChange = () => {
        this.setState({
            selectedModule: Object.assign({}, this.state.selectedModule, {
                is_downloadable: !this.state.selectedModule.is_downloadable,
            }),
        });
    }


    handleOnDrop = (e) => {

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

    handleMoudleTypeChanged = (e) => {
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

    updateModule = () => {

        const { oldModuleName, oldModuleDesc, selectedModule, oldIsDownloadable } = this.state;
        let validated = 1;

        if (oldModuleName === selectedModule.module_name && oldModuleDesc === selectedModule.module_desc && oldIsDownloadable === selectedModule.is_downloadable) {
            validated = 0;
            this.setState({ updateModalMessage: "Hiç bir değişiklik yapılmamıştır." })
        }

        if (Validator.isEmpty(selectedModule.module_name)) {
            validated = 0;
            this.setState({ moduleNameMessage: "Lütfen modül ismi giriniz." })
        }

        if (Validator.isEmpty(selectedModule.module_desc)) {
            validated = 0;
            this.setState({ moduleDescMessage: "Lütfen modül açıklaması giriniz." })
        }


        if (validated == 1) {

            axios.put(`http://localhost:3010/module/updatemodule`, {
                module_id: selectedModule.module_id,
                module_name: selectedModule.module_name,
                module_desc: selectedModule.module_desc,
                is_downloadable: selectedModule.is_downloadable,
                course_id: this.props.course_id
            })
                .then(res => {
                    this.getCourseModules();
                    this.setState({ updateModuleModal: false, modalMessage: "Modül başarıyla güncellenmiştir.", modalHeader: "Mesaj", messageModalColor: "blue", messageModal: true });
                })
                .catch(err => {
                    this.setState({ updateModalMessage: "Problem yaşanmıştır. Lütfen tekrardan deneyiniz." })
                });

        }


    }

    closeMessageModal = () => {
        this.setState({ messageModal: false });
    }

    updateModuleFile = () => {


        this.clearMessages();

        const { moduleType, selectedModule, file, downloadable } = this.state;
        console.log(selectedModule);
        let validated = true;

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
            data.append('module_id', selectedModule.module_id);
            data.append('course_id', this.props.course_id)
            data.append('module_type', moduleType)

            axios.put(`http://localhost:3010/module/updatemodulefile`,

                data

            ).then(res => {
                this.getCourseModules();
                this.setState({ updateModuleFileModal: false, modalMessage: "Modül başarıyla güncellenmiştir.", modalHeader: "Mesaj", messageModalColor: "blue", messageModal: true, updateModalMessage: "" });
            })
                .catch(err => {
                    this.setState({ updateModalMessage: "Problem yaşanmıştır. Lütfen tekrardan deneyiniz." })
                });
        }

    }


    render() {

        const { alertMessage, alertColor } = this.state;

        let mainLayout = (
            <p>Bu kursa modül eklenmemiştir.</p>
        )

        const marginTop = {
            marginTop: "10px"
        };

        let alert;
        if (alertMessage !== "") {
            alert = (
                <div style={marginTop}>
                    <Alert color={alertColor}>
                        {alertMessage}
                    </Alert>
                </div>
            )
        }

        if (this.state.courseModules.length > 0) {

            const courseModules = (

                this.state.courseModules.map((module) => (
                    {
                        module_name: module.module_name,
                        module_desc: module.module_desc,
                        edit: <Button color="primary" onClick={() => this.toggleUpdateModal(module)}>Düzenle</Button>,
                        edit_file: <Button color="primary" onClick={() => this.toggleFileUpdateModal(module)}>İçeriği Düzenle</Button>,
                        delete: <Button color="danger" onClick={() => this.toggleModuleDeleteModal(module)}>Sil</Button>
                    }
                ))
            )

            const modulesTable = {
                columns: [
                    {
                        label: 'Modül İsmi',
                        field: 'module_name',
                        sort: 'asc',
                        width: 200
                    },
                    {
                        label: 'Modul Açıklaması',
                        field: 'module_desc',
                        sort: 'asc',
                        width: 200
                    },
                    {
                        label: '',
                        field: 'edit',
                        width: 200
                    },
                    {
                        label: '',
                        field: 'edit_file',
                        width: 50
                    },
                    {
                        label: '',
                        field: 'delete',
                        width: 50
                    },

                ],
                rows: courseModules
            };
            mainLayout = (



                <MDBDataTable
                striped
                bordered
                large
                data={modulesTable}
            />


            )
        }


        return (
            <div className="animated fadeIn">


                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> {this.props.course_name} İçeriği
                        </CardHeader>
                    <CardBody>

                        {mainLayout}

                        {alert}
                    </CardBody>
                </Card>

                <Modal isOpen={this.state.modal} >
                    <ModalHeader>Modül Sil</ModalHeader>
                    <ModalBody>
                        <strong>{this.state.selectedModule.module_name}</strong> adlı modülü <strong>{this.props.course_name}</strong> adlı kurstan silmek istediğinize emin misiniz?
                        </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.deleteModule(this.state.selectedModule.module_id)}>Sil</Button>
                        <Button color="primary" onClick={this.closeModal}>Geri Dön</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.updateModuleModal} >
                    <ModalHeader>Modül Güncelle</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="courseName">Modül Adı:</Label>
                                <Input invalid={this.state.moduleNameMessage} type="text" name="moduleName" id="moduleName" value={this.state.selectedModule.module_name} onChange={this.handleModuleNameChanged} />
                                <FormText>{this.state.moduleNameMessage}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleText">Modül Açıklaması:</Label>
                                <Input invalid={this.state.moduleDescMessage} type="textarea" name="moduleDesc" id="moduleDesc" value={this.state.selectedModule.module_desc} onChange={this.handleModuleDescChanged} />
                                <FormText>{this.state.moduleDescMessage}</FormText>
                            </FormGroup>

                            <label>

                                <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} onChange={this.handleDownloadableChange} checked={this.state.selectedModule.is_downloadable} />{' '}
                                <span>Dosya indirilebilir.</span>
                            </label>

                        </Form>

                        {this.state.updateModalMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateModule}>Güncelle</Button>
                        <Button color="danger" onClick={this.closeUpdateModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.updateModuleFileModal} >
                    <ModalHeader>Modül İçeriğini Güncelle</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="courseType">Döküman Tipi:</Label>
                                <Input invalid={this.state.moduleTypeMessage} type="select" name="moduleType" id="moduleType" value={this.state.moduleType} onChange={this.handleMoudleTypeChanged}>
                                    <option value="0">Döküman tipi seçiniz</option>
                                    <option value="1">Video</option>
                                    <option value="2">PDF</option>
                                </Input>
                                <FormText>{this.state.moduleTypeMessage}</FormText>
                            </FormGroup>

                            <FormGroup>
                                <Label for="exampleFile">Dosya:</Label>
                                <Input disabled={this.state.moduleTypeChosen} type="file" name="file" onChange={this.handleOnDrop} />
                                <FormText>{this.state.moduleFileMessage}</FormText>
                            </FormGroup>

                        </Form>

                        {this.state.updateModalMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateModuleFile}>Güncelle</Button>
                        <Button color="danger" onClick={this.closeUpdateFileModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.messageModal} toggle={this.closeMessageModal}>
                    <ModalHeader style={{ backgroundColor: this.state.messageModalColor, color: "white" }} toggle={this.closeMessageModal}>{this.state.modalHeader}</ModalHeader>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{ backgroundColor: this.state.messageModalColor, color: "white" }} onClick={this.closeMessageModal}>Kapat</Button>
                    </ModalFooter>
                </Modal>

            </div>


        );
    }







}
export default ModuleOperations;