import React, { Component } from 'react';
import './App.css';
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import ContentBody from "./components/ContentBody";
import { BrowserRouter as Router } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.appSettings = {
      seoTitle: "Firat's Sample React App",
      siteOwner: 'Firat',
      footerText: 'Copyright Text',
      navItems: [
        { text: 'Home', toLink: '/' },
        { text: 'Boards', toLink: '/boards' },
        { text: 'Other Page', toLink: '#' },
        { text: 'Another Page', toLink: '#' },
        { text: '404 Route', toLink: '/404' },
      ]
    };
  }
  componentDidMount() {
    document.title = this.appSettings.seoTitle;
  }
  render() {
    return (
      <Router>
        <Header siteOwner={this.appSettings.siteOwner} navItems={this.appSettings.navItems} />
        <ContentBody />
        <Footer footerText={this.appSettings.footerText} />
      </Router>
    );
  }
}

export default App;