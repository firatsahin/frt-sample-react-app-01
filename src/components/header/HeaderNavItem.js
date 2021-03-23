import React from 'react';
import { NavLink } from 'react-router-dom';

class HeaderNavItem extends React.Component {
    render() {
        return (
            <NavLink to={this.props.navItem.toLink} isActive={(match, location) => {
                return (location.pathname === this.props.navItem.toLink);
            }} className="nav-item" activeClassName="active">{this.props.navItem.text}</NavLink>
        );
    }
}

export default HeaderNavItem;