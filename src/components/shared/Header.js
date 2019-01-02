import React from 'react';
import { Link , withRouter} from 'react-router-dom';



class Header extends React.Component {

    render() {
        return(
            // <div className="navbar d-flex flex-column flex-md-row align-items-center px-md-4 bg-white border-bottom ">
            //     <img width="auto" height="60" className="d-inline-block my-0 mr-md-auto" src={process.env.PUBLIC_URL + '/matcha_logo.svg'} />
            //     <nav className="my-2 my-md-0 mr-md-3">
            //         <a className="p-2" href="#">Browse</a>
            //         <a className="p-2" href="#">Match</a>
            //         <a className="p-2" href="#">Messages</a>
            //         <a className="p-2" href="#">Settings</a>
            //     </nav>
            //     <a className="btn btn-outline-primary" href="#">Sign up</a>
            // </div>

            <div className="landing-nav d-flex flex-column flex-md-row align-items-center px-md-4">
            <img width="auto" height="60" className="d-inline-block my-0 mr-md-auto" src={process.env.PUBLIC_URL + '/matcha_logo_white.svg'} />
            </div>

        )
    }
}

export default Header