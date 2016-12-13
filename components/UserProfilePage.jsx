import TaskStore from "../stores/TaskStore.js";
import MyNavbar from "./MyNavbar.jsx";

const UserProfilePage = React.createClass({

  getInitialState() {
    return({
      user: TaskStore.getCurrentUser(),
    })
  },

  render() {
    return(
      <div>
        <MyNavbar user={this.state.user}/>

        user profile of {this.state.user.displayName}
      </div>
    )
  }
});

module.exports = UserProfilePage;
