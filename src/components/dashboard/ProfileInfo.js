import React from 'react';

export class ProfileInfo extends React.Component {

    genderValue(value){
        var optionsGender = ['Man' , 'Woman'];
        return optionsGender[value];
    }
    orientationValue(value){
        var optionsGender = ['Women and Men' ,'Men', 'Woman'];
        return optionsGender[value];
    }

    tagsDisplay(tags){

        let div = [ ];

        for ( var i = 0 ; i < tags.length ; i++){
            div.push(
                <div  key={i} className="tags">
                    #{tags[i]}
                </div>
            )
        }
        return div;
    }

    imagesDisplay(images){

        let div= [];

        for ( var i = 0 ; i < images.length ; i++){
            div.push(
                <div  key={i} className="picture">
                    <img src={process.env.PUBLIC_URL+'img/'+images[i].path} alt="profile_img"/>
                </div>
            )
        }
        return div;

    }
    render (){
        const { userData } =this.props
        
        return(
            <div className="edit-profile grid-area">
                <div className="header">
                    <h1>Edit your profile <i className="fas fa-pen"></i></h1>
                </div>
                <div className="profile-picture">
                    <img src={process.env.PUBLIC_URL+'img/'+userData[0].profile_img} alt="profile_img"/>
                </div>
                <h1>{userData[0].first_name} {userData[0].last_name}</h1>
                <div className="edit-infos">
                    <h3>Personal information</h3>
                    <div className="profile-data">
                        <div className="data-details">
                            <h5>Age</h5>
                            <h4>{userData[0].age}</h4>
                        </div>
                        <div className="data-details">
                            <h5>Gender</h5>
                            <h4>{this.genderValue(userData[0].gender)}</h4>
                        </div>
                        <div className="data-details">
                            <h5>Location</h5>
                            <h4>{userData[0].location}</h4>
                        </div>
                    </div>
                </div>
                <div className="edit-interest">
                    <h3>What are you looking for ?</h3>
                    <p className="p-small">{this.orientationValue(userData[0].orientation)}</p>
                </div>
                <div className="edit-interest">
                    <h3>Bio</h3>
                    <p>{userData[0].bio}</p>
                </div>
                <div className="edit-interest" >
                    <h3>Your interests</h3>
                    <div className="display-tags">
                        {this.tagsDisplay(userData[1])}
                    </div>
                </div>
                <div className="edit-picture">
                    {this.imagesDisplay(userData[2])}
                </div>
            </div>
        )
    }
}