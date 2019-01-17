import React from 'react';
import { withRouter} from 'react-router-dom';
import authService from 'services/auth-service';
import { connect } from 'react-redux';
import { toCapitalize} from 'helpers';

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
                    <img src={process.env.PUBLIC_URL + '/matcha_logo_white.svg'} alt="logo"/>
                    <button className="navbar-toggler my-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-grip-lines"></i>
                        <i className="fas fa-grip-lines"></i>
                    </button>
                    <nav className="navbar navbar-expand-lg navbar-light my-nav">
                        <div className="collapse navbar-collapse my-collapse" id="navbarTogglerDemo03">
                            <div className="profile">
                                <img src={process.env.PUBLIC_URL + '/profile_default.svg'} alt="profile_img"/>
                                <a className="navbar-brand " href="/dashboard"> {toCapitalize(username)}</a>
                            </div>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0 my-ul">
                            <li className="nav-item my-li">
                                <a className="nav-link active" href="/browse">Browse <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item my-li">
                                <a className="nav-link">Notifications</a>
                            </li>
                            <li className="nav-item my-li">
                                <a className="nav-link" >Messages</a>
                            </li>
                            <li className="nav-item my-li">
                                <a className="nav-link" onClick={this.handleLogout}>Logout</a>
                            </li>
                            </ul>
                            <form className="form-inline my-2 my-lg-0">
                                <button className="btn my-2 my-sm-0 search" ><i className="fas fa-search"></i></button>
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
