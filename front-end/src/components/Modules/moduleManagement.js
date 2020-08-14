import React, { Component } from 'react'
import {
    Button, Spinner, FormGroup, Input, Container,
    Label, Form, Alert, Table, Nav, NavItem, NavLink,
    CardHeader, Card, CardBody, Modal, ModalHeader, ModalFooter, ModalBody
} from 'reactstrap';
import CreateModule from '../Modules/createModule'
import axios from 'axios';
import ModuleOperations from './moduleOperations';
import CreateExam from '../Exam/createExam'
import ExamOperations from '../Exam/examOperations'

class RoleFormComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            alertMessage: "",
            alertColor: "primary",
            chosenTab: 1,
        }

    }


    render() {

        const { alertMessage, alertColor, chosenTab } = this.state;

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

        let card;
        if (chosenTab === 1) {
            card = (
                <ModuleOperations course_id={this.props.course_id} course_name = {this.props.course_name} />
            )
        }
        else if (chosenTab === 2) {
            card = (
                <CreateModule course_id={this.props.course_id} course_name = {this.props.course_name} />
            )
        }
        else if (chosenTab === 3){
            card = (
                <ExamOperations course_id={this.props.course_id} course_name = {this.props.course_name} />
            )
        }
        else {
            card = (
                <CreateExam course_id={this.props.course_id} course_name = {this.props.course_name} />
            )
        }



        return (
            <div>

                <Nav tabs>
                    <NavItem>
                        <NavLink onClick={() => { this.setState({ chosenTab: 1, alertMessage: "" }) }}>
                            Kurs Modüllerini Listele
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink onClick={() => { this.setState({ chosenTab: 2, alertMessage: "" }) }}>
                            Kurs Modülü Ekle
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink onClick={() => { this.setState({ chosenTab: 3, alertMessage: "" }) }}>
                            Kurs Sınavını Düzenle
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink onClick={() => { this.setState({ chosenTab: 4, alertMessage: "" }) }}>
                            Kursa Sınav Ekle
                        </NavLink>
                    </NavItem>
                </Nav>

                {card}

                {alert}

            </div>
        );

    }


}




export default RoleFormComponent;
