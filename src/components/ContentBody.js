import React from 'react';
import GeneralSettings from "./GeneralSettings";
import Board from "./board/Board";

class ContentBody extends React.Component {
    constructor(props) {
        super(props);
        this.whatToDoChanged = this.whatToDoChanged.bind(this);
        this.state = {
            generalSettings: {whatToDo: 'increment'}
        };
    }

    whatToDoChanged(value) {
        this.state.generalSettings.whatToDo = value;
        this.setState(this.state);
    }

    render() {
        return (
            <div id="content-body">
                <GeneralSettings settings={this.state.generalSettings} onWhatToDoChange={this.whatToDoChanged} />
                <Board rows="6" cols="8" boardNo="1" settings={this.state.generalSettings}/>
                <Board rows="7" cols="5" boardNo="2" settings={this.state.generalSettings}/>
            </div>
        );
    }
}

export default ContentBody;