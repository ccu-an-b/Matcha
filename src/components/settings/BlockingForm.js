import React from 'react';
import userService from 'services/user-service';
import { imgPath, imagesLoaded} from 'helpers';

export class BlockingForm extends React.Component {
    
    constructor(){
        super();
        this.state = {
            selectProfile: [],
            loadImg:true
        }
    }

    componentWillMount(){
        return userService.getBlockedProfiles()
        .then((profiles) => {this.setState({profiles})})
    }

    selectOne = (event) => {
        const username = event.target.id
        var selectProfile = this.state.selectProfile;
        if (selectProfile[username] ){
            delete selectProfile[username]
        }
        else
            selectProfile[username] = username;
        this.setState({selectProfile});
    }
    renderProfiles(profiles){
        return profiles.map((profile, key) => {
            var className = this.state.selectProfile[profile[0].username] ? 'select' : '';
            return (
                <div className={this.state.loadImg ? "img_loading img_none": "img_loading" } key={key} onClick={this.selectOne}>
                    <img    src={imgPath(profile[0].profile_img)} 
                        onLoad={this.handleImageChange}
                        onError={this.handleImageChange}
                        alt="profile_img" id={profile[0].username} 
                        className={className} />
                </div>
            )
        })
    }

    handleImageChange = () => {
        this.setState({
          loadImg: !imagesLoaded(this.searchElement)
        });
    };

    render() {
        const {profiles, selectProfile} = this.state

        if (profiles){
            return (
                <form ref={element => {this.searchElement = element;}}>
                    <h1>Manage blocked profiles</h1>
                    <div className="profiles">
                    {profiles.data.length ? this.renderProfiles(profiles.data) :  <p>You didn't blocked anyone.</p>}
                    </div>
                    <button className="button full" disabled={selectProfile !==[] && Object.values(selectProfile).length? "" :"disabled" } onClick={(e) => this.props.submitCb(e, selectProfile)}>
                        Unblock
                    </button>     
                </form>
            ) 
        }
        else {
            return (
                <div className= "page loading " >
                   <img src={process.env.PUBLIC_URL+'/loading.gif'} alt="loading_gif" />
                </div>
            )
        }
    }
}