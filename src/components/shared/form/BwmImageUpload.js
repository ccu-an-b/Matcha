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
            selectedFiles: [],
            deletedFiles:[],
        }
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        const {defaultValue} = this.props;
        this.initializeValue(defaultValue)
    }

    setupReader(){
        this.reader = new FileReader();
        
        this.reader.addEventListener('load', (event) => {
            this.updateArrayState(this.state.img_nb, event.target.result);
        });
    }

    onChange(event) {
    
        const selectedFile = event.target.files[0];
        if (selectedFile){
            this.updateArraySelectedFiles(this.state.img_nb, selectedFile);
            this.setState({
                selectedFile
            });
            this.reader.readAsDataURL(selectedFile);
        }
    }

    onError(error){
        console.log(error)
    }

    onSuccess(uploadedImage){
        const {input: {onChange}} = this.props;
        onChange(uploadedImage);
    }

    updateArrayState(index, item){
        let newArray = this.state.files.slice()
        if (item === 'delete')
        {
            newArray.splice(index, 1);
            this.setState({
                files: newArray,
                img_nb: this.state.img_nb-1
            })
        }
        else
        {
            newArray[index] = item;
            this.setState({
                files: newArray,
                img_nb: this.state.img_nb+1
            })
        }
        if (this.state.selectedFiles.slice())
            this.onSuccess(this.state.selectedFiles.slice())
    }

    updateArraySelectedFiles(index, item){
        let newFilesSelected = this.state.selectedFiles.slice()
        if (item === 'delete')
        {
            if (newFilesSelected[index])
                newFilesSelected.splice(index, 1);
            else
            {
                actions.deleteImage(this.state.files[index].replace("img/", ""))
            }
        }  
        else
            newFilesSelected[index] = item;

        this.setState({
            selectedFiles: newFilesSelected,
        })
    }

    initializeValue(images){

        var newArray = [];
        for (var i = 0; i < images.length ; i++){
            newArray[i] = process.env.PUBLIC_URL+'img/'+images[i].path
        }
        this.setState({
            img_nb: images.length,
            files: newArray
        })
    }

    previewImage() {
        let div = []
        const { files } = this.state;
 
        for (let i = 0; i < files.length; i++) {
            div.push(
                <div className='img-preview-container' key={i}>
                    <div className='img-preview' style={{'backgroundImage' : 'url(' + files[i]+ ')'}} >
                        <div onClick={() => {this.updateArrayState(i, "delete"); this.updateArraySelectedFiles(i, "delete")}}  className="hover">
                            Delete
                        </div>
                    </div>
                </div>
            )
        }
        return div
    }

    render() {
        const {meta: {touched, error}} = this.props;
        const { show, img_nb } = this.state;
       
        const showHideClassName = show ? 'img-upload-container img display-block' : 'img-upload-container img display-none';

        return (
            <div className="img-upload-display">
                <div className="img-preview-div">
                    {this.previewImage()}
                </div>

               { img_nb < 4 && <div className={showHideClassName} >
                    <label className="img-upload btn btn-bwm">
                        <i className="fas fa-plus"></i>
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
            </div>
        ) 
    }
}