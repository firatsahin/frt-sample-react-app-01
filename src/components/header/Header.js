import React, { Component } from 'react';
import HeaderNav from "./HeaderNav";
import UserWelcome from "../UserWelcome";

class Header extends Component {
    render() {
        return (
            <header style={{ backgroundColor: '#ffe595' }}>
                <div style={{ float: 'right' }}>
                    <UserWelcome></UserWelcome>
                </div>
                <h3 style={{ marginTop: 0 }}>{this.props.siteOwner}'s Sample React App</h3>
                <HeaderNav attrProp="top menu" />
            </header>
        );
    }
}

export default Header;