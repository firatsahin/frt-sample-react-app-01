import React from 'react';
import GeneralSettings from "../components/GeneralSettings";
import Board from "../components/board/Board";
import { setTitle } from '../utility/common';

class Boards extends React.Component {
    constructor(props) {
        super(props);
        this.whatToDoChanged = this.whatToDoChanged.bind(this);
        this.state = {
            generalSettings: { whatToDo: 'increment', testVal: 23 },
            boards: [
                { rows: 6, cols: 8 },
                { rows: 7, cols: 5 }
            ]
        };
    }

    whatToDoChanged(value) {
        this.setState((state) => {
            state.generalSettings.whatToDo = value;
            return state;
        });
    }

    render() {
        return (
            <>
                <GeneralSettings settings={this.state.generalSettings} onWhatToDoChange={this.whatToDoChanged} />
                <div style={{ display: 'flex' }}>
                    {this.state.boards.map((board, index) => {
                        return (
                            <Board rows={board.rows} cols={board.cols} boardNo={index + 1} key={index} settings={this.state.generalSettings} />
                        );
                    })}
                </div>
            </>
        );
    }

    // component lifecycle events
    componentDidMount() {
        console.log("boards component did mount");
        setTitle("Boards");
    }
    componentDidUpdate() {
        console.log("boards component did update");
    }
    componentWillUnmount() {
        console.log("boards component will unmount");
        setTitle(null);
    }
}

export default Boards;