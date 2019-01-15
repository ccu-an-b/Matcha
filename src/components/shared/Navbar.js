import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import authService from 'services/auth-service';
import { connect } from 'react-redux';
import { toCapitalize } from 'helpers';
import Select from 'react-select'
import Modal from '../shared/modal/Modal';



class Navbar extends React.Component {
    constructor() {
        super();
        this.state = {
            show: true,
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    hideModal = () => {
        this.setState({ show: false, });
    }

    showModal = () => {
        this.setState({ show: true, });
    }

    handleLogout() {
        this.props.logout();
        this.props.history.push('/');
    }

    render() {

        const { username } = this.props.auth;

        const usersOptions = [
            { value: 'ocean', label: 'Didier' },
            { value: 'blue', label: 'Robert' },
            { value: 'purple', label: 'Michel' },
            { value: 'red', label: 'Jean-Pierre' },
        ];

        const searchCriteria = [
            { value: 'vanilla', label: 'Bagarreur' },
            { value: 'chocolate', label: 'Sportif' },
            { value: 'strawberry', label: 'Alcoolique' },
            { value: 'salted-caramel', label: 'Raciste' },
        ];

        const groupedOptions = [
            {
                label: 'Search criteria',
                options: searchCriteria,
            },
            {
                label: 'User name',
                options: usersOptions,
            },
        ];


        const groupStyles = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        };
        const groupBadgeStyles = {
            backgroundColor: '#EBECF0',
            borderRadius: '2em',
            color: '#172B4D',
            display: 'inline-block',
            fontSize: 12,
            fontWeight: 'normal',
            lineHeight: '1',
            minWidth: 1,
            padding: '0.16666666666667em 0.5em',
            textAlign: 'center',
        };

        const formatGroupLabel = data => (
            <div style={groupStyles}>
                <span>{data.label}</span>
                <span style={groupBadgeStyles}>{data.options.length}</span>
            </div>
        );

        const MyComponent = () => (
            <form className='form'>
                <div className='form-header'>
                    <img alt="logo" src={process.env.PUBLIC_URL + '/matcha_icon.svg'}></img>
                    <h2>ready set match</h2>
                </div>
                <div className="form-submit">
                    <div style={{ width: '500px' }}>
                        <Select
                            placeholder="Search..."
                            options={groupedOptions}
                            formatGroupLabel={formatGroupLabel}
                        />
                    </div>
                </div>
            </form>
        );

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
                                <button onClick={this.showModal} class="btn my-2 my-sm-0 search" ><i class="fas fa-search"></i></button>
                            </li>
                        </ul>
                    </div>
                    <Modal show={this.state.show} handleClose={this.hideModal} children={<MyComponent />} modalType={"form"} activate={true}/> />
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