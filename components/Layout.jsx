import {Navbar, Toaster, Position, Intent} from "@blueprintjs/core";
const TaskListView = require('./TaskListView');
import TaskMainView from "./TaskMainView.jsx";
import TaskStore from "../stores/TaskStore.js";

const OurToaster = Toaster.create({
  position: Position.TOP,
    iconName: 'tick',
    timeout: 2000,
});

const leftwidth = 250;

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
    };
  },

  componentWillMount() {
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
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">Task</div>
            <input className="pt-input" placeholder="Search files..." type="text" />
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-home">Home</button>
            <button className="pt-button pt-minimal pt-icon-document">Files</button>
            <span className="pt-navbar-divider"></span>
            <button className="pt-button pt-minimal pt-icon-user">{this.state.data ? this.state.data.name : ""}</button>
            <button className="pt-button pt-minimal pt-icon-notifications"></button>
            <button className="pt-button pt-minimal pt-icon-cog"></button>
          </div>
        </nav>
        <div>
            <TaskListView data={this.state.data} style={leftstyle}/>
            <TaskMainView data={this.state.data} task={this.state.selectedTask} style={rightstyle} />
        </div>
      </div>
    )
  }
});
module.exports = Layout;
