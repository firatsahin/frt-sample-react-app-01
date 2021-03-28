import React from 'react';
import HeaderNavItem from './HeaderNavItem';

class HeaderNav extends React.Component {
    render() {
        return (
            <div id="header-navigation">
                {this.props.navItems.map((navItem, index) => {
                    return (
                        <HeaderNavItem navItem={navItem} key={index} />
                    );
                })}
            </div>);
    }
}

export default HeaderNav;