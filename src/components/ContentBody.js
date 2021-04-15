import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";

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

        const LazyRoutes = {
            Home: React.lazy(() => import("../routes/Home")),
            Boards: React.lazy(() => import("../routes/Boards")),
            FunctionComponent: React.lazy(() => import("../routes/FunctionComponent")),
            MyAlgoTrader: React.lazy(() => import("../routes/MyAlgoTrader")),
            NotFound: React.lazy(() => import("../routes/404"))
        };

        return (
            <div id="content-body">
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route path="/" exact component={() => <LazyRoutes.Home person={{ name: 'Firat' }}></LazyRoutes.Home>} />
                        <Route path="/boards" component={LazyRoutes.Boards} />
                        <Route path="/function-component" component={() => <LazyRoutes.FunctionComponent propVal={"prop value 1"} />} />
                        <Route path="/my-algo-trader" component={LazyRoutes.MyAlgoTrader} />
                        <Route path="/my-algo-trader-backtest" component={() => <LazyRoutes.MyAlgoTrader backTesting={true} />} />
                        <Route path="*" component={LazyRoutes.NotFound} />
                    </Switch>
                </Suspense>
            </div>
        );
    }
}

export default ContentBody;