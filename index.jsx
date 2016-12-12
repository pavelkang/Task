window._ = require('underscore');
window.React = require('react');
window.ReactDOM = require('react-dom');
const Layout = require('components/Layout');

class App extends React.Component {
  render() {
    return (
      <div>
        <Layout/>
      </div>
    )
  }
};

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
