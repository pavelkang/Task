import {Navbar, Toaster, Position, Intent} from "@blueprintjs/core";
const TaskListView = require('./TaskListView');
import TaskMainView from "./TaskMainView.jsx";
import TaskStore from "../stores/TaskStore.js";
import {Link} from "react-router";
import MyNavbar from "./MyNavbar.jsx";

const OurToaster = Toaster.create({
  position: Position.TOP,
    iconName: 'tick',
    timeout: 2000,
});

const leftwidth = 200;

const leftstyle = {
  float: "left",
  width: leftwidth,
  height: 'auto',
}

const rightstyle = {
  width: 'auto',
  height: "100%",
  marginLeft: leftwidth+1,
  padding: 0,
}

const Layout = React.createClass({

  getDefaultProps() {
    return {
      data: null,
      selectedTask: null,
    };
  },

  getInitialState() {
    return {
      data: TaskStore.getData(),
      selectedTask: TaskStore.getCurrentTask(),
      currentUser: TaskStore.getCurrentUser(),
    };
  },

  componentDidMount() {
    TaskStore.on("change:selectedTask", () => {
      this.setState({
        selectedTask: TaskStore.getCurrentTask(),
      });
    });
    TaskStore.on("change:task", () => {
      this.setState({
        selectedTask: TaskStore.getCurrentTask(),
        data: TaskStore.getData(),
      });
    });
    TaskStore.on("change:all", () => {
      this.setState({
        selectedTask: TaskStore.getCurrentTask(),
        data: TaskStore.getData(),
      });
    });

    TaskStore.on("change:created", () => {
      this.setState({
        selectedTask: TaskStore.getCurrentTask(),
        data: TaskStore.getData(),
      }, () => {
        OurToaster.show({
          message: "Task Created!",
          intent: Intent.PRIMARY,
        });
      });
    });

    TaskStore.on("change:saved", () => {
      this.setState({
        data: TaskStore.getData(),
      });
    });

    TaskStore.on("change:deleted", () => {
      this.setState({
        selectedTask: TaskStore.getCurrentTask(),
        data: TaskStore.getData(),
      }, () => {
        OurToaster.show({
          message: "Task Deleted!",
          intent: Intent.DANGER,
        })
      });
    });

  },

  render() {
    return (
      <div>
        <MyNavbar user={this.state.currentUser} />
        <div>
            <TaskListView data={this.state.data} style={leftstyle}/>
            <TaskMainView data={this.state.data} task={this.state.selectedTask} style={rightstyle} />
        </div>
      </div>
    )
  }
});
module.exports = Layout;
