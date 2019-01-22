import React from 'react';
import * as actions from 'actions';

export class BwmProfileUpload extends React.Component {
    
    constructor(){
        super();

        this.setupReader()

        this.state = {
            selectedFile: undefined,
            imageBase64: ''
        }

        this.onChange = this.onChange.bind(this);
    }

    setupReader(){
        this.reader = new FileReader();

        this.reader.addEventListener('load', (event) => {
            this.setState({imageBase64: event.target.result});
        });
    }
    onChange(event) {
    
        const selectedFile = event.target.files[0];
        if (selectedFile){
            this.setState({
                selectedFile
            });
            this.reader.readAsDataURL(selectedFile);
            actions.uploadProfile(selectedFile).then(
                (uploadedImage) => { this.onSucces(uploadedImage)},
                (error) => { this.onError(error)})
        }
    }

    onError(error){
        console.log(error)
    }

    onSucces(uploadedImage){
        const {input: {onChange}} = this.props;
        onChange(uploadedImage);
    }
    
    render() {
        const {label, meta: {touched, error}} = this.props;
        const { imageBase64 } = this.state;

        return (
            <div className='img-upload-container' >
                <label className="img-upload btn btn-bwm">
                    <span className='upload-text'>Add a profile picture</span>
                    <input type='file'
                            accept='.jpg, .png, .jpeg, .gif'
                            onChange={this.onChange}
                            ref={input => this.inputUpload = input} />
                </label>
                {/* { selectedFile &&
                    <button className ='btn btn-success btn-upload'
                            type = 'button'
                            disabled={!selectedFile}
                            onClick={() =>this.uploadImage()}>
                        Upload Image
                    </button>

                } */}

                { touched &&
                    ((error && <div className='alert alert-danger'>{error}</div>))
                }

                { imageBase64 &&
                    <div className='img-preview-container'>
                        <div className='img-preview' style={{'backgroundImage' : 'url(' + imageBase64 + ')'}}>
                        </div>
                        <div onClick={() => this.inputUpload.click()}  className="hover">
                            Edit
                        </div>
                    </div>
                }
            </div>
        )
    }
}