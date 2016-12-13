import {Link} from "react-router";

const MyNavbar = React.createClass({
  render() {
    return(
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">Task</div>
            <input className="pt-input" placeholder="Search tasks..." type="text" />
          </div>
          <div className="pt-navbar-group pt-align-right">
            <Link to="/">
            <button className="pt-button pt-minimal pt-icon-home">Home</button>
            </Link>
            <span className="pt-navbar-divider"></span>
            <Link to="/profile">
            <button className="pt-button pt-minimal pt-icon-user">{this.props.user.displayName}</button>
            </Link>
            <button className="pt-button pt-minimal pt-icon-notifications"></button>
            <button className="pt-button pt-minimal pt-icon-cog"></button>
          </div>
        </nav>
      </div>
    )
  }
});

module.exports = MyNavbar
