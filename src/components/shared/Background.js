import React from 'react';
import { connect } from 'react-redux';

export class Background extends React.Component {

    render() {
        const { isAuth} = this.props.auth;
        if (isAuth){
            return (
                <div id="background-header"></div>
            )
        }
        else
            return "";
    }
}


function mapStateToProps(state){
    return {
        auth: state.auth,
    }
}
export default connect(mapStateToProps)(Background);
