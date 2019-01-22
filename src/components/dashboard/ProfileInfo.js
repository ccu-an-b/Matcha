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

    render (){
        const { userData } =this.props
        
        return(
            <div className="edit-profile grid-area">
                <div className="header">
                    <h1>Edit your profile</h1>
                </div>
                <div className="profile-picture">
                    <img src={process.env.PUBLIC_URL+'img/'+userData[0].profile_img} alt="profile_img"/>
                </div>
                <h1>{userData[0].first_name} {userData[0].last_name}</h1>
                <div className="edit-infos">
                    <h3>Personal information<i className="fas fa-pen"></i></h3>
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
                    <h3>What are you looking for ?<i className="fas fa-pen"></i></h3>
                    <p className="p-small">{this.orientationValue(userData[0].orientation)}</p>
                </div>
                <div className="edit-interest">
                    <h3>Bio<i className="fas fa-pen"></i></h3>
                    <p>{userData[0].bio}</p>
                </div>
                <div className="edit-interest">
                    <h3>Your interests <i className="fas fa-pen"></i></h3>
                    <p>#traveling #cooking #summer #jazz #friends #art #walk #dogs #design #architecture #photo #nature #fun </p>
                </div>
                <div className="edit-picture">
                    <div className="picture">
                        <img src="https://images.unsplash.com/photo-1540218660726-95c6764dd7ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" alt="profile_img"/>
                    </div>
                    <div className="picture">
                        <img src="https://images.unsplash.com/photo-1467020421390-2fb2647a413e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1235&q=80" alt="profile_img"/>
                    </div>
                    <div className="picture">
                        <img src="https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="profile_img"/>
                    </div>
                    <div className="picture-add">
                        <i className="fas fa-plus"></i>
                    </div>
                </div>
            </div>
        )
    }
}