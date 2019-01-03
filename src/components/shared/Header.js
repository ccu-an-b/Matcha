import React from 'react';
import { Link , withRouter} from 'react-router-dom';
import authService from 'services/auth-service';


class Header extends React.Component {

    render() {

        if (authService.isAuthentificated())
        {
            return(
                <div className="navbar d-flex flex-column flex-md-row align-items-center px-md-4 bg-white border-bottom connected">
                    <Link to='/dashboard'><img width="auto" height="60" className="d-inline-block my-0 mr-md-auto" src={process.env.PUBLIC_URL + '/matcha_logo.svg'} /></Link>
                    <nav className="my-2 my-md-0 mr-md-3">
                        <a className="p-2" href="#">Browse</a>
                        <a className="p-2" href="#">Match</a>
                        <a className="p-2" href="#">Messages</a>
                        <a className="p-2" href="#">Settings</a>
                    </nav>
                    {/* <a className="btn btn-outline-primary" href="#">Sign up</a> */}
                </div>
            )

        }
        else{
            return(
                <div className="landing-nav d-flex flex-column flex-md-row align-items-center px-md-4">
                    <img width="auto" height="60" className="d-inline-block my-0 mr-md-auto" src={process.env.PUBLIC_URL + '/matcha_logo_white.svg'} />
                </div>
    
            )
        }
    }
}

export default Header