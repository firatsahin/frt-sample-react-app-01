import React from 'react';
import HeaderNavItem from './HeaderNavItem';
import { ADD_NEW, REMOVE_LAST } from "../../redux/topNavMenu/topNavMenu.actions";

import { connect } from "react-redux";

class HeaderNav extends React.Component {
    render() {
        return (
            <div id="header-navigation">
                {this.props.navItems.map((navItem, index) => {
                    return (
                        <HeaderNavItem navItem={navItem} key={index} />
                    );
                })}
                {this.props.navItems.length < this.props.maxNavItems ? ( // add button
                    <button onClick={() => this.props.addNew('New Menu Text')} style={{ marginLeft: 5 }}>+ Add New</button>
                ) : null}
                {this.props.navItems.length > 0 ? ( // remove button
                    <button onClick={this.props.removeLast} style={{ marginLeft: 10 }}>- Remove Last</button>
                ) : null}
                <span style={{ marginLeft: 8 }}>({this.props.navItems.length} {this.props.attrProp}{this.props.navItems.length !== 1 ? 's' : ''})</span>
            </div>);
    }
}

export default connect(state => { // map state to props
    return {
        navItems: state.topNav.items,
        maxNavItems: state.topNav.maxItemsAllowed
    };
}, dispatch => { // map dispatch to props
    return {
        addNew: (text) => dispatch({ type: ADD_NEW, payload: { newMenuText: text } }),
        removeLast: () => dispatch({ type: REMOVE_LAST })
    };
})(HeaderNav);