import React from 'react';
import { Link , withRouter} from 'react-router-dom';
import authService from 'services/auth-service';
import { connect } from 'react-redux';
import { toCapitalize} from 'helpers';
import Navbar from "./Navbar";

class Header extends React.Component {
    constructor() {
        super ();

        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout() {
        this.props.logout();
        this.props.history.push('/');
    }

    render() {

        const {username} = this.props.auth;
        if (authService.isAuthentificated())
        {
            return(
                <header>
                    <img src={process.env.PUBLIC_URL + '/matcha_logo_white.svg'}/>
                    <button class="navbar-toggler my-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="fas fa-grip-lines"></i>
                        <i class="fas fa-grip-lines"></i>
                    </button>
                    <nav class="navbar navbar-expand-lg navbar-light my-nav">
                        <div class="collapse navbar-collapse my-collapse" id="navbarTogglerDemo03">
                            <div class="profile">
                                <img src={process.env.PUBLIC_URL + '/profile_default.svg'}/>
                                <a class="navbar-brand " href="/dashboard"> {toCapitalize(username)}</a>
                            </div>
                            <ul class="navbar-nav mr-auto mt-2 mt-lg-0 my-ul">
                            <li class="nav-item my-li">
                                <a class="nav-link active" href="/browse">Browse <span class="sr-only">(current)</span></a>
                            </li>
                            <li class="nav-item my-li">
                                <a class="nav-link" href="#">Notifications</a>
                            </li>
                            <li class="nav-item my-li">
                                <a class="nav-link" href="#">Messages</a>
                            </li>
                            <li class="nav-item my-li">
                                <a class="nav-link" onClick={this.handleLogout}>Logout</a>
                            </li>
                            </ul>
                            <form class="form-inline my-2 my-lg-0">
                                <button class="btn my-2 my-sm-0 search" ><i class="fas fa-search"></i></button>
                            </form>
                        </div>
                    </nav>
                </header>
            )

        }
        else{
            return(
                <div className="landing-nav d-flex flex-column flex-md-row align-items-center px-md-4">
                    <img alt="logo" width="auto" height="60" className="d-inline-block my-0 mr-md-auto" src={process.env.PUBLIC_URL + '/matcha_logo_white.svg'} />
                </div>
    
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps)(Header));
