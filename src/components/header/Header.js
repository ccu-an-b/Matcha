import React from 'react';
import io from "socket.io-client";
import { withRouter, Link } from 'react-router-dom';
import authService from 'services/auth-service';
import { connect } from 'react-redux';
import { toCapitalize, imgPath , getSearchUrl} from 'helpers';
import * as actions from 'actions';
import Notifications from './Notifications';
import SearchForm from './Search';

const socket = io('localhost:3001');

class Header extends React.Component {

    constructor(){
        super();
        this.state = {
            newMessages: 0,
            unreadMessages: [],
            showSearch: false,
        }
    }

    componentWillMount() {
        if (authService.isAuthentificated()){
            this.props.dispatch(actions.fetchUserProfile(authService.getUsername()))
            this.props.dispatch(actions.fetchPublicData())
            this.props.dispatch(actions.fetchTags())
        }
        socket.on('RECEIVE_CHAT_MESSAGE', (data) => {
            if (data.user_for_id === this.props.auth.userId)
                this.setState({ newMessages: this.state.newMessages+1 , unreadMessages: [...this.state.unreadMessages, data] });
        });
    }
    componentWillUnmount(){
        socket.off('RECEIVE_CHAT_MESSAGE')
    }
    
    handleLogout = () => {
        actions.logoutOffline(authService.getUsername())
        this.props.logout();
        this.props.history.push('/');
    }

    getProfileImage(userData) {
        if (userData.length > 1 && userData[0].profile_img)
            return imgPath(userData[0].profile_img)
        else
            return process.env.PUBLIC_URL + '/profile_default.svg';
    }

    showSearch = () => {
        this.setState({showSearch: !this.state.showSearch})
    }

    hideSearch = () => {
        this.setState({showSearch: false})
    }
    sendSearch = () => {
        let url

        if (this.props.form.searchForm.values)
        {
            url = getSearchUrl(this.props.form.searchForm.values)
            this.props.history.push(url);
            this.setState({ showSearch: false})
        }
    }

    render() {
        const { username } = this.props.auth;
        const userData = this.props.user;
        const {newMessages, showSearch} = this.state;
        
        if (authService.isAuthentificated()) {
            return (
                <header>
                    <img src={process.env.PUBLIC_URL + '/matcha_logo_white.svg'} alt="logo" />
                    <button className="navbar-toggler my-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-grip-lines"></i>
                        <i className="fas fa-grip-lines"></i>
                    </button>
                    <nav className="navbar navbar-expand-lg navbar-light my-nav">
                        <div className="collapse navbar-collapse my-collapse" id="navbarTogglerDemo03">
                            <div className="profile-tab" onClick={() => this.hideSearch()}>
                                <img src={this.getProfileImage(userData)} alt="profile_img" />
                                <Link className="navbar-brand " to="/dashboard"> {toCapitalize(username)}</Link>
                            </div>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0 my-ul">
                                <li className="nav-item my-li">
                                    <Link className="nav-link active" to="/browse">Browse <span className="sr-only">(current)</span></Link>
                                </li>
                                <li className="nav-item my-li">
                                    <Notifications addNotification={this.props.addNotification} userId={this.props.auth.userId} showSearch={showSearch}/>
                                </li>
                                <li className="nav-item my-li">
                                    <Link className="nav-link notification" to="/chat">
                                        Messages
                                        {newMessages !== 0 ? <div className="notification-bubble">{newMessages}</div> : ""}
                                    </Link>
                                </li>
                                <li className="nav-item my-li">
                                    <a className="nav-link" onClick={this.handleLogout}>Logout</a>
                                </li>
                            </ul>
                            <div className={showSearch ? "form-inline my-2 my-lg-0 my-search active" : "form-inline my-2 my-lg-0 my-search" }>
                                <button className="btn my-2 my-sm-0 search" onClick={() => this.showSearch()}>
                                   {!showSearch ? <i className="fas fa-search"></i>
                                        : <i className="fas fa-times"></i> 
                                   } 
                                </button>
                                {showSearch &&
                                    <SearchForm optionsTags={this.props.tags.data} users={this.props.publicData.data} submitCb={this.sendSearch}/>
                                }
                            </div>
                        </div>
                    </nav>
                </header>
            )

        }
        else {
            return (
                <div className="landing-nav d-flex flex-column flex-md-row align-items-center px-md-4">
                    <img alt="logo" width="auto" height="60" className="d-inline-block my-0 mr-md-auto" src={process.env.PUBLIC_URL + '/matcha_logo_white.svg'} />
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        user: state.user.data,
        tags: state.tags,
        publicData: state.publicData,
        form: state.form
    }
}

export default withRouter(connect(mapStateToProps)(Header));
