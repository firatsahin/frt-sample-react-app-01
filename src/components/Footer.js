import React from 'react';

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
        return <footer style={this.styles.footerRoot}>{this.ftText}</footer>;
    }
}

export default Footer;