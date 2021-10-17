import React from 'react';
import { NavLink } from 'react-router-dom';

class HeaderNavItem extends React.Component {
    render() {
        return (
            <NavLink to={this.props.navItem.toLink} isActive={(match, location) => {
                if (match && match.isExact) return true; // exact match case
                // if there is no exact match > additional rules can be added below
                return (location.pathname === this.props.navItem.toLink);
            }} className="nav-item" activeClassName="active">{this.props.navItem.text}</NavLink>
        );
    }
}

export default HeaderNavItem;