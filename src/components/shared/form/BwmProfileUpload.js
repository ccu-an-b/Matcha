import React from 'react';
import * as actions from 'actions';
import { imgPath } from 'helpers';

export class BwmProfileUpload extends React.Component {
    
    constructor(){
        super();

        this.setupReader()

        this.state = {
            selectedFile: undefined,
            imageBase64: '',
        }
    }

    setupReader(){
        this.reader = new FileReader();

        this.reader.addEventListener('load', (event) => {
            this.setState({imageBase64: event.target.result});
        });
    }
    onChange = event => {
    
        const selectedFile = event.target.files[0];
        if(selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png' || selectedFile.type=== 'image/jpg' || selectedFile.type === 'image/gif'  )
        {
            if (selectedFile && /^[A-Z0-9._%+-]+\.[A-Z]+\.[A-Z]{2,4}$/i.test(selectedFile.name) === false ){
                this.setState({
                    selectedFile
                });
                this.reader.readAsDataURL(selectedFile);
                actions.uploadProfile(selectedFile).then(
                    (uploadedImage) => { this.onSucces(uploadedImage)},
                    (error) => { this.onError(error)})
            }   
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
        const {defaultValue, meta: {touched, error}} = this.props;
        const { imageBase64 } = this.state;

        return (
            <div className='img-upload-container profile-upload' >
                <label className="img-upload btn btn-bwm">
                    <span className='upload-text'>Add a profile picture</span>
                    <input type='file'
                            accept='.jpg, .png, .jpeg, .gif'
                            onChange={this.onChange}
                            ref={input => this.inputUpload = input} />
                </label>

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
                {defaultValue && !imageBase64 &&
                    <div className='img-preview-container'>
                        <div className='img-preview' style={{'backgroundImage' : 'url(' + imgPath(defaultValue) + ')'}}>
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