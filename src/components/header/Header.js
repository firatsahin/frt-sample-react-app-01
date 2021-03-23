import React, { Component } from 'react';
import HeaderNav from "./HeaderNav";

class Header extends Component {
    render() {
        return (
            <header>
                <h3 style={{ marginTop: 0 }}>{this.props.siteOwner}'s Sample React App</h3>
                <HeaderNav navItems={this.props.navItems} />
            </header>
        );
    }
}

export default Header;