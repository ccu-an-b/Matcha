import React from 'react';
import * as actions from 'actions';

export class BwmImageUpload extends React.Component {
    
    constructor(){
        super();

        this.setupReader()

        this.state = {
            selectedFile: undefined,
            show: true,
            img_nb: 0,
            files: [],
            selectedFiles: []
        }

        this.onChange = this.onChange.bind(this);
    }

    setupReader(){
        this.reader = new FileReader();

        this.reader.addEventListener('load', (event) => {
            console.log("2")
            this.updateArrayState(this.state.img_nb, event.target.result);
        });
    }
    onChange(event) {
        console.log("1")
        const selectedFile = event.target.files[0];
        if (selectedFile){
            this.setState({
                selectedFile
            });
            this.reader.readAsDataURL(selectedFile);
         
            // actions.uploadImage(selectedFile, 'coucou').then(
            //     (uploadedImage) => { this.onSucces(uploadedImage)},
            //     (error) => { this.onError(error)})
         
        }
    }

    onError(error){
        console.log(error)
    }

    onSucces(uploadedImage){
        const {input: {onChange}} = this.props;
        onChange(uploadedImage);
    }

    uploadImage() {
        const { selectedFile } = this.state;
        debugger;
        if (selectedFile){
            actions.uploadImage(selectedFile).then(
                (uploadedImage) => { this.onSucces(uploadedImage)},
                (error) => { this.onError(error)})
        }
    }

    updateArrayState(index, item){
        let newFiles = this.state.files.slice()
        if (item === 'delete')
        {
            newFiles.splice(index, 1);
            this.setState({
                files: newFiles,
                img_nb: this.state.img_nb-1
            })
        }
        else
        {
            newFiles[index] = item.result;
            this.setState({
                files: newFiles,
                img_nb: this.state.img_nb+1
            })
        }
    }

    // updateArraySelectedFiles(index, item){
    //     let newFilesSelected = this.state.selectedFiles.slice()
    //     if (item === 'delete')
    //     {
    //         newFilesSelected.splice(index, 1);
    //         this.setState({
    //             selectedFiles: newFilesSelected,
    //         })
    //     }
    //     else
    //     {
    //         newFilesSelected[index] = item;
    //         this.setState({
    //             selectedFiles: newFilesSelected,
    //         })
    //     }
    // }

    previewImage() {
        let div = []
        const { files } = this.state;
 
        for (let i = 0; i < files.length; i++) {
          let children = []
            children.push(
                <div className='img-preview-container'>
                    <div className='img-preview' style={{'backgroundImage' : 'url(' + files[i]+ ')'}} >
                    <div onClick={() => this.updateArrayState(i, "delete")}  className="hover">
                        Delete
                    </div>
                    </div>
                </div>
            )
          div.push(children)
        }
        return div
    }

    render() {
        const {label, meta: {touched, error}} = this.props;
        const { selectedFile, imageBase64, show, img_nb, files } = this.state;
        const showHideClassName = show ? 'img-upload-container img display-block' : 'img-upload-container img display-none';

        return (
            <div className="img-upload-display">
                <div className="img-preview-div">
                    {this.previewImage()}
                </div>

               { img_nb < 4 && <div className={showHideClassName} >
                    <label className="img-upload btn btn-bwm">
                        <i class="fas fa-plus"></i>
                        <input type='file'
                                accept='.jpg, .png, .jpeg, .gif'
                                onChange={this.onChange}
                                ref={input => this.inputUpload = input} />
                    </label>
                    { touched &&
                        ((error && <div className='alert alert-danger'>{error}</div>))
                    }
                </div>
                }

                {/* { selectedFile &&
                    <button className ='btn btn-success btn-upload'
                            type = 'button'
                            disabled={!selectedFile}
                            onClick={() =>this.uploadImage()}>
                        Upload Image
                    </button>

                } */}
            </div>
        ) 
    }
}