window._ = require('underscore');
window.React = require('react');
window.ReactDOM = require('react-dom');
import { Router, Route, hashHistory } from 'react-router';
const Layout = require('components/Layout');
const UserProfilePage = require('components/UserProfilePage');

class App extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Layout} />
        <Route path="/profile" component={UserProfilePage} />
      </Router>
    )
  }
};

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
