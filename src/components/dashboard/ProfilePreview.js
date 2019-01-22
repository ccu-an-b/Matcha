import React from 'react';

export class ProfilePreview extends React.Component {

    render (){
        const { userData } = this.props

        return (
            <div className="profile grid-area">
            <div className="img">
            {/* <i className="fas fa-ellipsis-v"></i>  */}
                <img src={process.env.PUBLIC_URL+'img/'+userData[0].profile_img} alt="profile_img"/>
                <h3>{userData[0].first_name}</h3>
                <h5 className="online">Online</h5>
                <div className="button"><i className="fas fa-sliders-h"></i></div>
            </div>
            <div className="profile-data">
                <div className="data-details">
                <h5>Age</h5>
                <h4>{userData[0].age}</h4>
                </div>
                <div className="data-details">
                <h5>Location</h5>
                <h4>{userData[0].location}</h4>
                </div>
                <div className="data-details">
                <h5>Score</h5>
                <h4>150</h4>
                </div>
            </div>
            <div className="profile-more">
            <h5>Show more</h5>
            </div>
        </div>
        )
    }
}