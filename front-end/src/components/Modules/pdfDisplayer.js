import React, { Component } from 'react';
import { Document, Page , pdfjs  } from 'react-pdf';
import {
    ModalBody, Alert, ButtonGroup, Button, InputGroup, Input, InputGroupAddon
} from 'reactstrap';
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PdfDisplayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            numPages: null,
            pageNumber: 1,
            isLoaded: false,
            document: null,
            alertMessage: "",
            changePageNumber: "",
        }

    }
    componentDidMount = () => {
        console.log(this.props);
        // this.getDocument();
    }
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    previousPage = () => {
        const { numPages, pageNumber} = this.state;
        if (numPages > 1){

            if(pageNumber - 1 == 0){
                this.setState({ pageNumber: numPages});
            }
            else {
                this.setState({ pageNumber: this.state.pageNumber - 1});
            }   

        }
    }

    nextPage = () => {
        
        const { numPages, pageNumber} = this.state;
        if (numPages > 1){

            if(pageNumber + 1 > numPages){
                this.setState({ pageNumber: 1});
            }
            else {
                this.setState({ pageNumber: this.state.pageNumber + 1});
            }   

        }
       
        
    }

    changePage = () => {
        
        const { numPages, pageNumber, changePageNumber} = this.state;
        console.log(changePageNumber);
        if (changePageNumber <= numPages && changePageNumber > 0 && changePageNumber != pageNumber){

            this.setState({pageNumber: parseInt(changePageNumber)})
            
        }
        else {
            this.setState({changePageNumber: ""});
        }
       
        
    }

    changePageNumberHandler = (e) => {
        let { value } = e.target;
        this.setState({ changePageNumber: value });
    }

    getDocument = () => {
        console.log(this.props.module_path);
        axios.get('http://localhost:3010/getpdf', {
            params: {
                path: this.props.module_path

            }
        }).then(res => {
            
            const doc = res.data;
            console.log(doc);
            this.setState({ document: doc });
        }).catch(err => {
            this.setState({ error: err })
        });
    }
    render() {
        const { alertMessage, alertColor, pageNumber, numPages} = this.state;
        console.log(pageNumber);
        let downloadLink;
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
        const url = `http://localhost:3010/getpdf?path=${this.props.module_path}`
        if(this.props.is_downloadable == true ){
            downloadLink = (
                <div className = "text-center" style = {{marginTop: "10px"}}>
                    <a target="_blank" rel="noopener noreferrer" href = {url}>Dökümanı İndir</a>
                </div>
            )
        }

        
        return (
          <div>
                <ModalBody>
                <Document
                    file = {url}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                >
                <Page size="A1" pageNumber={pageNumber}>

                </Page>
                </Document>
                <div className = "text-center">
                    <p>Sayfa {pageNumber}/{numPages}</p>
                    <ButtonGroup >
                    <Button onClick = {() => this.previousPage()}>Önceki Sayfa</Button>
                    <Button onClick = {() => this.nextPage()}>Sonraki Sayfa</Button>
                    </ButtonGroup>

                    <InputGroup style = {{marginTop: "10px"}}>
   
                    <Input value = {this.state.changePageNumber} onChange = {this.changePageNumberHandler} placeholder="Sayfaya Numarası Girin" style = {{width: "100px"}}/>
                    <InputGroupAddon addonType="append"><Button color="secondary" onClick = {this.changePage}>Sayfa Girin</Button></InputGroupAddon>
                    </InputGroup>
                </div>
                
                {downloadLink}
                
                </ModalBody>

                {alert}
            </div>

        );
    }

}
export default PdfDisplayer;