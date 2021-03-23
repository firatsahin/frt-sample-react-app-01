import React from 'react';
import HeaderNavItem from './HeaderNavItem';

class HeaderNav extends React.Component {
    constructor(props) {
        super();
        this.styles = {
            headerNavRoot: {
                backgroundColor: '#ffc107',
                padding: 8
            }
        };
        console.log(props);
    }
    render() {
        return (
            <div id="header-navigation" style={this.styles.headerNavRoot}>
                {this.props.navItems.map((navItem, index) => {
                    return (
                        <HeaderNavItem navItem={navItem} key={index} />
                    );
                })}
            </div>);
    }
}

export default HeaderNav;