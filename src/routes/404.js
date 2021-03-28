import React from 'react';
import { NavLink } from "react-router-dom";
import AppSettings from '../data/AppSettings';

class NotFound extends React.Component {
    render() {
        return (
            <>
                <div>Route Not Found</div>
                <NavLink to="/">Go to Home Page</NavLink>
            </>
        );
    }

    // component lifecycle events
    componentDidMount() {
        console.log("404 component did mount");
        document.title = "Not Found | " + AppSettings.seoTitle; // put pre-title
    }
    componentDidUpdate() {
        console.log("404 component did update");
    }
    componentWillUnmount() {
        console.log("404 component will unmount");
        document.title = AppSettings.seoTitle; // clear pre-title
    }
}

export default NotFound;