import React from 'react';
import { ProfileInfo } from './ProfileInfo';
import { ProfilePreview } from './ProfilePreview';

export class ProfileGrid extends React.Component {

    render (){

        const { userData } = this.props
      
        return(
            <div className="grid-container">
                <ProfilePreview userData= { userData }/>
            <div className="last-view grid-area">
            <h2>Your latest visits.</h2>
            <div className="profiles-display">
                <div className="one-profile online">
                <div className="img">
                <img src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                </div>
                <h4>Alicia</h4>
                </div>
                <div className="one-profile">
                <div className="img">
                <img src="https://images.unsplash.com/photo-1495078065017-564723e7e3e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1300&q=80" alt="profile_img"/>
                </div>
                <h4>Dan</h4>
                </div>
                <div className="one-profile online">
                <div className="img">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                </div>
                <h4>Lea</h4>
                </div>
                
                <div className="one-profile">
                <div className="img">
                <img src="https://images.unsplash.com/photo-1517935541300-19815e88fa63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                </div>
                <h4>John</h4>
                </div>
                <div className="one-profile">
                <div className="img">
                <img src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                </div>
                <h4>Christopher</h4>
                </div>
            </div>
                
            </div>
            
            <div className="last-like grid-area">
                <h2>They liked your profile !</h2>
                <div className="profiles-display">
                <div className="one-profile online">
                <div className="img">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                </div>
                <h4>Lea</h4>
                </div>
                <div className="one-profile">
                <div className="img">
                <img src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                </div>
                <h4>Christopher</h4>
                </div>
            </div>
            </div>
            
            
            <ProfileInfo userData= { userData } />
           
            <div className="matchs grid-area">
                <div className="header">
                <h1>Your Matchs</h1>
                </div>
                <div className="display-matchs">
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1517935541300-19815e88fa63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                    <div className="match-info">
                    <h4>John, 30</h4>
                        <h5>Last seen 2d ago</h5>
                    </div>
                    </div>
                </div>
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                    <div className="match-info">
                    <h4>Alicia, 23</h4>
                        <h5 className="online">Online</h5>
                    </div>
                    </div>
                </div>
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1495078065017-564723e7e3e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1300&q=80" alt="profile_img"/>
                    <div className="match-info">
                    <h4>Dan, 49</h4>
                        <h5 >Last seen 15h ago</h5>
                    </div>
                    </div>
                </div>
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                        <div className="match-info">
                        <h4>Christopher, 27</h4>
                        <h5 >Last seen 1w ago</h5>
                        </div>
                    </div>
                </div>
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img" />
                    <div className="match-info">
                    <h4>Lea, 25</h4>
                        <h5 className="online">Online</h5>
                    </div>
                    </div>
                </div>
                <div className="one-match">
                <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1517935541300-19815e88fa63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                    <div className="match-info">
                    <h4>John, 30</h4>
                        <h5>Last seen 2d ago</h5>
                    </div>
                </div>
                </div>
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                    <div className="match-info">
                    <h4>Alicia, 23</h4>
                        <h5 className="online">Online</h5>
                    </div>
                    </div>
                </div>
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1495078065017-564723e7e3e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1300&q=80" alt="profile_img"/>
                    <div className="match-info">
                    <h4>Dan, 49</h4>
                        <h5 >Last seen 15h ago</h5>
                    </div>
                    </div>
                </div>
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                        <div className="match-info">
                        <h4>Christopher, 27</h4>
                        <h5 >Last seen 1w ago</h5>
                        </div>
                    </div>
                </div>
                <div className="one-match">
                    <div className="one-match-content">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="profile_img"/>
                    <div className="match-info">
                    <h4>Lea, 25</h4>
                        <h5 className="online">Online</h5>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    
        )
    }

}