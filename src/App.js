import React from 'react';
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContentBody from "./components/ContentBody";

class App extends React.Component {
  render() {
    return (
        <div>
          <Header siteOwner="Firat"/>
          <ContentBody/>
          <Footer footerText="Copyright Text"/>
        </div>
    );
  }
}

export default App;