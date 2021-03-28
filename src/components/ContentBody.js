import React from 'react';
import { Route, Switch } from "react-router-dom";
import Home from '../routes/Home';
import Boards from '../routes/Boards';
import NotFound from '../routes/404';

class ContentBody extends React.Component {
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
        //console.log("ContentBody render fired!");
        return (
            <div id="content-body">
                <Switch>
                    <Route path="/" exact component={() => <Home person={{ name: 'Firat' }}></Home>} />
                    <Route path="/boards" component={Boards} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </div>
        );
    }
}

export default ContentBody;