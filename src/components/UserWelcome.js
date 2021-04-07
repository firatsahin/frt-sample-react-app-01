import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { LOG_ME_IN, LOG_ME_OUT, REQ_STARTED, REQ_ENDED } from "../redux/userAuth/userAuth.actions";

import { connect } from "react-redux";

class UserWelcome extends Component {
    makeRequest() {
        console.log("request started");
        this.props.startRequest();
        setTimeout(() => {
            console.log("request ended");
            //this.props.endRequest();
            this.props.logMeIn('Firat');
        }, 1500);
    }

    render() {
        return (
            <>
                <div className={this.props.userAuth.isAuthenticated ? 'has-auth' : 'no-auth'}>
                    {this.props.userAuth.reqState !== 'running' ? (
                        <>
                            <span>Welcome, <b>{!this.props.userAuth.isAuthenticated ? 'Guest' : this.props.userAuth.userName}</b>! </span>
                            {!this.props.userAuth.isAuthenticated ? (
                                <NavLink to="#" onClick={this.makeRequest.bind(this)}>Login</NavLink>
                            ) : (
                                <NavLink to="#" onClick={this.props.logMeOut}>Logout</NavLink>
                            )}
                        </>
                    ) : (
                        <span>Logging in...</span>
                    )}
                </div>
            </>
        );
    }
}

export default connect(state => { // map state to props
    return {
        userAuth: state.userAuth
    };
}, dispatch => { // map dispatch to props
    return {
        logMeIn: (uName) => dispatch({ type: LOG_ME_IN, payload: { userName: uName } }),
        logMeOut: () => dispatch({ type: LOG_ME_OUT }),
        startRequest: () => dispatch({ type: REQ_STARTED }),
        endRequest: () => dispatch({ type: REQ_ENDED }),
    };
})(UserWelcome);