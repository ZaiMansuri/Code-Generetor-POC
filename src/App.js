import React from 'react';
import { Upload, Button, Input } from 'antd';
import axios from 'axios';
import styled from "styled-components";
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "antd/dist/antd.css";
import './App.css';
const ContainerFile = styled.div`
    width: 80%;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    margin: 0 auto;
`
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            fileList: [],
            loaded: 0,
            formData: {
                username: "",
                password: "",
                port: null,
                ip: "",
            }
        }
    }
    handleChange = (event) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [event.target.name]: event.target.value
            }
        });
    };
    checkMimeType = (event) => {
        //getting file object
        let files = event.target.files
        //define message container
        let err = []
        // list allow mime type
        const types = ['application/pdf']
        // loop access array
        for (var x = 0; x < files.length; x++) {
            // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err[x] = files[x].type + ' is not a supported format\n';
            }
        };
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
            // discard selected file
            toast.error(err[z])
            event.target.value = null
        } console.log('mimetype chk :>> ', event.target.files);

        return true;
    }
    maxSelectFile = (event) => {
        let files = event.target.files
        console.log('max select chk :>> ', event.target.files);
        if (files.length > 1) {
            const msg = 'Only 1 file can be uploaded at a time'
            event.target.value = null
            toast.warn(msg)
            return false;
        }
        return true;
    }
    checkFileSize = (event) => {
        let files = event.target.files
        let size = 2000000000
        let err = [];
        for (var x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err[x] = files[x].type + 'is too large, please pick a smaller file\n';
            }
        };
        for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
            // discard selected file
            toast.error(err[z])
            event.target.value = null
        }
        console.log('max sixe chk :>> ', event.target.files);

        return true;
    }
    onChangeHandler = event => {
        var files = event.target.files
        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
            // if return true allow to setState
            console.log('files :>> ', files);
            this.setState({
                fileList: files,
                loaded: 0
            })
        }
    }
    onClickHandler = () => {
        const { fileList, formData } = this.state;
        const data = new FormData();
        fileList.forEach(file => {
            data.append('file', file);
        });
        console.log('data :>> ', data);
        axios.post("http://localhost:5000/upload", data, { headers: formData }, {
            onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                })
            },
        })
            .then(res => { // then print response status
                this.setState({
                    fileList: [],
                    loaded: 100,
                });
                toast.success('upload success')
            })
            .catch(err => { // then print response status
                toast.error('upload fail')
            })
    }

    render() {
        const { formData, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <div className="App">
                <h3 className="heading-h3"> POC : Generate Code for uploaded Documentation of MQTT in Node </h3>
                <div style={{ padding: "15px", alignContent: 'center', margin: '9px' }}>
                    <Input
                        value={formData.username}
                        name='username'
                        onChange={this.handleChange}
                        placeholder="User name"
                        style={{ padding: "10px", width: '100px', margin: '9px' }}
                    />
                    <Input value={formData.password} name="password" placeholder="Password" style={{ padding: "10px", width: '100px', margin: '9px' }} onChange={this.handleChange} />
                    <Input value={formData.ip} name='ip' placeholder="IP" style={{ padding: "10px", width: '100px', margin: '9px' }} onChange={this.handleChange} />
                    <Input value={formData.port} style={{ padding: "10px", width: '100px', margin: '9px' }} name="port" max={5} placeholder="PORT" onChange={this.handleChange} />
                </div>
                {/* <UploadContainer /> */}
                <ContainerFile>

                    <div className="offset-md-3 col-md-6">
                        <div className="form-group files" >
                            <Upload {...props} >
                                <Button onChange={this.onChangeHandler} >Select File</Button>
                            </Upload>
                            {/* <input type="file" className="form-control" /> */}
                        </div>
                        <div className="form-group" style={{ alignContent: 'center' }}>
                            <ToastContainer />
                            <Progress max="100" color="success" animated={true} value={this.state.loaded} >{Math.round(this.state.loaded, 2)}%</Progress>
                        </div>
                        <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
                    </div>
                </ContainerFile>
            </div>
        );
    }
}

export default App;
