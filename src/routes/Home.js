import React from 'react';
import AppSettings from '../data/AppSettings';

// React component > function usage
/*const Home = () => {
    const [name, setName] = useState('firat');
    const [age, setAge] = useState(23);

    const incAge = inc => setAge(age + inc);

    return (
        <>
            Home Page for {name} who is {age} years old.
            <button onClick={() => incAge(2)}>age+1</button>
        </>
    );
};*/

// React component > class usage
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inc: 1,
            person: { ...props.person, age: 23 }
        };
    }

    incAge(inc = 1) {
        this.setState((state) => {
            state.person.age += this.state.inc;
            return state;
        });
    }

    incChanged(e) {
        //console.log("changed to:", e.target, e.target.value, this);
        const newInc = parseInt(e.target.value);
        this.setState((state) => {
            state.inc = newInc;
            return state;
        });
    }

    windowSizeChanged() {
        this.setState((state) => {
            state.windowWH = [window.innerWidth, window.innerHeight];
            return state;
        });
    }

    render() {
        const person = this.state.person;
        return (
            <>
                Home Page for {person.name} who is {person.age} years old.
                <button onClick={() => this.incAge(2)}>age+</button>
                <input type="number" value={this.state.inc} style={{ width: 35 }} onChange={this.incChanged.bind(this)} />
                <br /><br />
                <div>Window Width x Height: <b>{this.state.windowWH ? this.state.windowWH[0] : 'N/A'}</b> x <b>{this.state.windowWH ? this.state.windowWH[1] : 'N/A'}</b></div>
            </>
        );
    }

    // component lifecycle events
    wscEvent = this.windowSizeChanged.bind(this);
    componentDidMount() {
        console.log("home component did mount");
        document.title = AppSettings.seoTitle;

        this.windowSizeChanged();
        window.addEventListener("resize", this.wscEvent); // add window.resize event after mounting
    }
    componentDidUpdate() {
        console.log("home component did update");
    }
    componentWillUnmount() {
        console.log("home component will unmount");
        window.removeEventListener("resize", this.wscEvent); // remove window.resize event before unmounting
    }
}

export default Home;