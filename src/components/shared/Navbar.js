import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import authService from 'services/auth-service';
import { connect } from 'react-redux';
import { toCapitalize } from 'helpers';
import Button from 'react-bootstrap/lib/Button';
import Badge from 'react-bootstrap/lib/Badge';

class Navbar extends React.Component {
    constructor() {
        super();

        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout() {
        this.props.logout();
        this.props.history.push('/');
    }

    render() {

        const { username } = this.props.auth;
        if (authService.isAuthentificated()) {
            return (
                <nav class="navbar navbar-expand-lg navbar-light my-nav">
                    <div class="collapse navbar-collapse my-collapse" id="navbarTogglerDemo03">
                        <div class="profile">
                            <img src="https://images.unsplash.com/photo-1502292754603-a0891e807332?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80" />
                            <a class="navbar-brand " href="/dashboard"> {toCapitalize(username)}</a>
                        </div>
                        <ul class="navbar-nav mr-auto mt-2 mt-lg-0 my-ul">
                            <li class="nav-item my-li">
                                <a class="nav-link" href="#"><i class="fas fa-glasses"></i> Browse</a>
                            </li>
                            <li class="nav-item my-li">
                                <a class="nav-link" href="#"><i class="fas fa-user"></i> Profile</a>
                            </li>

                            <li class="nav-item my-li">
                                <a class="nav-link" onClick={this.handleLogout}><i class="fas fa-sign-out-alt"></i> Logout</a>
                            </li>
                            <li class="nav-item">
                                <button class="btn my-2 my-sm-0 search" ><i class="fas fa-envelope"></i></button>
                                <button class="btn my-2 my-sm-0 search" ><i class="fas fa-bell"></i></button>
                                <button class="btn my-2 my-sm-0 search" ><i class="fas fa-search"></i></button>
                            </li>

                        </ul>
                    </div>
                </nav>
            )

        }
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps)(Navbar));