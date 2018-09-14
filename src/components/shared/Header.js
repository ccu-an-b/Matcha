import React from 'react';
import { Link , withRouter} from 'react-router-dom';
// import { connect } from 'react-redux';
// import RentalSearchInput from 'components/rental/RentalSearchInput'


class Header extends React.Component {

    render() {
        return(
            <div className="navbar d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
                <img width="auto" height="60" className="d-inline-block my-0 mr-md-auto" src={process.env.PUBLIC_URL + '/matcha_logo_2.png'} />
                <nav className="my-2 my-md-0 mr-md-3">
                    <a className="p-2" href="#">Browse</a>
                    <a className="p-2" href="#">Match</a>
                    <a className="p-2" href="#">Messages</a>
                    <a className="p-2" href="#">Settings</a>
                </nav>
            <a className="btn btn-outline-primary" href="#">Sign up</a>
        </div>

        )
    }
}

export default Header