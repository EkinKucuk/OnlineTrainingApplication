import React, { Component } from 'react'
import { Player, ControlBar, ForwardControl, LoadingSpinner, PlaybackRateMenuButton } from 'video-react';
import {
    Modal, ModalHeader, ModalFooter, ModalBody, Alert
} from 'reactstrap';
import axios from 'axios';
import "video-react/dist/video-react.css";
class VideoDisplayerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            alertMessage: "",
            video: null
        }

    }
    componentDidMount = () => {
        // this.getVideo();
    }
    getVideo = () => {

        console.log(this.props.module_path);
        axios.get('http://localhost:3010/getvideo', {
            params: {
                path: this.props.module_path

            }
        }).then(res => {
            const vid = res.data;
            console.log(vid);
            this.setState({ video: vid });
        }).catch(err => {
            this.setState({ error: err })
        });

    }
    render() {
        const { alertMessage, alertColor, video } = this.state;
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

        const url = `http://localhost:3010/getvideodownload?path=${this.props.module_path}`
        if(this.props.is_downloadable == true ){
            downloadLink = (
                <div className = "text-center" style = {{marginTop: "10px"}}>
                    <a  target="_blank" rel="noopener noreferrer" href = {url} download>Video'yu İndir</a>
                </div>
            )
        }
        return (
            <div>
                <ModalBody>

                    <Player
                        src={url}
                    >
                    <LoadingSpinner />
                    <ControlBar autoHide={true}>
                    <ForwardControl seconds={5} order={3.1} />
                    <ForwardControl seconds={10} order={3.2} />
                    <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
                    </ControlBar>
                    </Player>
                    
                    {downloadLink}
                </ModalBody>
                {alert}
            </div>
        );
    }


}
export default VideoDisplayerComponent;