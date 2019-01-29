import React from 'react';
import { ProfileInfo } from './ProfileInfo';
import { ProfilePreview } from './ProfilePreview';
import { ProfileViewLike } from './ProfileViewLike';
import { ProfileMatch } from './ProfileMatch';
import ProfileForm from './ProfileForm';

export class ProfileGrid extends React.Component {
    constructor(props){
        super(props)
        this.state ={
           showEdit: false,
           isLoading: true
        }
        this.showEdit = this.showEdit.bind(this);
        this.editRef = React.createRef()
    }

    componentDidMount(){
            this.setState({isLoading:false})
    }

    showEdit(){
        if (!this.state.showEdit)
            this.editRef.current.scrollIntoView({behavior: 'smooth'})
        this.setState({showEdit: !this.state.showEdit})
    }
    render (){

        const { userData, editProfile , optionsTags} = this.props
      
        return(
            <div className="grid-container">
                <ProfilePreview userData= { userData[0] } user = {userData[0].username}/>
            <div className="last-view grid-area">
                <h2>Your latest visits.</h2>
                {!this.state.isLoading &&
                    <ProfileViewLike type={1} />
                }
            </div>
            
            <div className="last-like grid-area">
                <h2>They liked your profile !</h2>
                {!this.state.isLoading &&
                    <ProfileViewLike type={2} />
                }
            </div>
          
            <span ref={this.editRef}></span>
            {this.state.showEdit ?  <div className="edit-profile grid-area edit">
                                        <div className="profile-form">
                                        <div className="header">
                                            <h1>Edit your profile <i className="fas fa-times" onClick={this.showEdit}></i></h1>
                                        </div>
                                        <ProfileForm  submitCb={editProfile} userData={userData}  optionsTags={optionsTags}/>
                                    </div></div> :  <ProfileInfo userData= { userData } user = {userData[0].username} handleClick = {this.showEdit}/> 
            }
            <div className="matchs grid-area">
                <div className="header">
                <h1>Your Matchs</h1>
                </div>
                {!this.state.isLoading &&
                   <ProfileMatch type={3}/>
                }
            </div>
        </div>
    
        )
    }

}