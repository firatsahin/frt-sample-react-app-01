import React, { Component } from 'react';
import './App.css';
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import ContentBody from "./components/ContentBody";
import { /*BrowserRouter (for HTML5 History API routing) (needs server config too)*/ HashRouter } from 'react-router-dom';
import AppSettings from './data/AppSettings';

class App extends Component {
  componentDidMount() {
    console.log("App component did mount");
  }
  render() {
    return (
      <HashRouter>
        <Header siteOwner={AppSettings.siteOwner} />
        <ContentBody />
        <Footer footerText={AppSettings.footerText} />
      </HashRouter>
    );
  }
}

export default App;