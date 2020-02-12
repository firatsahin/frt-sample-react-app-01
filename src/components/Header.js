import React from 'react';

class Header extends React.Component {
    render() {
        return <header>This is {this.props.siteOwner}'s Sample React App</header>;
    }
}

export default Header;