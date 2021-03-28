import React, { Component } from 'react';
import './App.css';
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import ContentBody from "./components/ContentBody";
import { BrowserRouter as Router } from 'react-router-dom';
import AppSettings from './data/AppSettings';

class App extends Component {
  componentDidMount() {
    console.log("App component did mount");
  }
  render() {
    return (
      <Router>
        <Header siteOwner={AppSettings.siteOwner} navItems={AppSettings.navItems} />
        <ContentBody />
        <Footer footerText={AppSettings.footerText} />
      </Router>
    );
  }
}

export default App;