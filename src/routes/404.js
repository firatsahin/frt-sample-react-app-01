import React from 'react';
import { NavLink } from "react-router-dom";
import { setTitle } from '../utility/common';

class NotFound extends React.Component {
    render() {
        return (
            <>
                <div>Page Not Found</div>
                <NavLink to="/">Go to Home Page</NavLink>
            </>
        );
    }

    // component lifecycle events
    componentDidMount() {
        console.log("404 component did mount");
        setTitle("Page Not Found");
    }
    componentDidUpdate() {
        console.log("404 component did update");
    }
    componentWillUnmount() {
        console.log("404 component will unmount");
        setTitle(null);
    }
}

export default NotFound;