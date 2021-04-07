import React, { useState, useEffect } from 'react';
import AppSettings from '../data/AppSettings';
import PropTypes from 'prop-types';
import { REMOVE_LAST } from "../redux/topNavMenu/topNavMenu.actions";

import { useSelector, useDispatch } from "react-redux";

const FunctionComponent = (props) => {
    const [myBool, setMyBool] = useState(false);
    const [myObj, setMyObj] = useState({ id: 3, name: 'Firat', gender: 'M' });

    // redux usage with hooks (for functional components)
    const numOfTopMenus = useSelector(state => state.topNav.items.length);
    const dispatch = useDispatch();

    useEffect(() => { // effect 1
        console.log("useEffect() 1 set");
        document.title = "Functional Component | " + AppSettings.seoTitle; // put pre-title
        return () => {
            console.log("useEffect() 1 unset");
            document.title = AppSettings.seoTitle; // clear pre-title
        }
    });

    // component actions
    const processMyBool = () => myBool ? 3 : -3;
    const btnAction = (e) => {
        console.log("button action", e.target);
        setMyObj({ ...myObj, name: 'Jessica', gender: 'F' })
    }

    return (
        <>
            <div>This is a Functional Component {props.propVal}<br />(hooks tested here: useState, useEffect etc.)</div>
            <br />
            <div>My Bool Value: <span onClick={() => setMyBool(!myBool)} style={{ color: myBool ? 'green' : 'red', cursor: 'pointer' }}>{myBool ? 'True' : 'False'} {processMyBool()}</span></div>
            <br />
            <div>
                <pre>{JSON.stringify(myObj, null, ' ')}</pre>
                <br />
                <button onClick={(e) => { btnAction(e) }}>Modify Object</button>
            </div>
            <br />
            <h4>Interacting w/Redux Store Below (useSelector, useDispatch hooks..)</h4>
            <div>Num of Top Nav Menus: {numOfTopMenus}</div>
            {numOfTopMenus > 0 ? (
                <button onClick={() => dispatch({ type: REMOVE_LAST })}>- Remove Last Top Menu Item</button>
            ) : null}
        </>
    );
}

FunctionComponent.propTypes = {
    propVal: PropTypes.string.isRequired
};

export default FunctionComponent;