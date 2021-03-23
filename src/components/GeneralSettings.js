import React from 'react';

class GeneralSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {settings: this.props.settings};
    }

    whatToDoChanged(e) {
        //log("changed", e.target.value);
        //this.state.settings.whatToDo = e.target.value;
        if (typeof this.props.onWhatToDoChange === 'function') this.props.onWhatToDoChange(e.target.value);
        //this.setState(this.state);
    }

    render() {
        return (
            <div id="general-settings" style={{backgroundColor:'bisque'}}>
                <h2>General Settings</h2>
                What To Do:&nbsp;
                <select value={this.state.settings.whatToDo} onChange={this.whatToDoChanged.bind(this)}>
                    <option>decrement</option>
                    <option>increment</option>
                </select>
                <div>
                    Prop Val: {this.props.settings.whatToDo}
                    <br/>
                    State Val: {this.state.settings.whatToDo}
                </div>
            </div>
        );
    }
}

export default GeneralSettings;