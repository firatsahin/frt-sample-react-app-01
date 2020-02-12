import React from 'react';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.ftText = this.props.footerText + " | " + new Date().getFullYear();
    }

    render() {
        return <footer>{this.ftText}</footer>;
    }
}

export default Footer;