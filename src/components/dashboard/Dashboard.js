import React from 'react';
import { connect } from 'react-redux';
export class Dashboard extends React.Component {
    constructor(){
        super()
        this.state ={
            errors:[],
        }
    }

    render(){

        return(
            <div>Test</div>
        )
    }
}
function mapStateToProps(state) {
    return{
        dashboard: state.dashboard
    }
}

export default connect(mapStateToProps)(Dashboard)