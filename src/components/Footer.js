import React from 'react';
import UserWelcome from "./UserWelcome";

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.ftText = this.props.footerText + " | " + new Date().getFullYear();
        this.styles = {
            footerRoot: {
                backgroundColor: '#8bc34a'
            }
        };
    }

    render() {
        return (
            <footer style={this.styles.footerRoot}>
                <div style={{ float: 'left' }}>{this.ftText}</div>
                <div style={{ float: 'right' }}>
                    <UserWelcome></UserWelcome>
                </div>
                <div style={{ clear: 'both' }}></div>
            </footer>
        );
    }
}

export default Footer;