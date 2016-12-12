import { Tree, Classes, AnchorButton, Spinner, Intent} from "@blueprintjs/core";
import * as TaskAction from "../actions/TaskAction.js";
import CreateNewTaskDialogComponent from "./CreateNewTaskDialogComponent";

const TaskListView = React.createClass({

  renderTasks(task, idx) {    
    return (
      {
        key: task.id,
        depth: 1,
        label: task.title,
        iconName: "folder-close",
        path: [idx],
        id: task.id,
      }
    )
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.state.data) {
      this.setState({
        data: nextProps.data,
        tasks: nextProps.data ? _.values(nextProps.data.tasks) : [],
      });
    }
  },

  getInitialState() {
    return {
      dialogOpen: false,
      data: this.props.data,
      tasks: this.props.data ? _.values(this.props.data.tasks) : [],
    }
  },

  handleNodeClick(nodeData, _nodePath, e) {
    TaskAction.selectTask({
      'id': nodeData.key,
    });
  },

  onDialogCancel() {
    this.setState({
      dialogOpen: false,
    });
  },

  onCreateClicked() {
    this.setState({
      dialogOpen: true,
    });
  },

  render() {
    var x = (_.values(this.state.tasks)).map(this.renderTasks);
    return (
      <div style={this.props.style}>
      <div>
      {
        this.state.data === null ?
        <div id="tasklistspinner"><center><Spinner intent={Intent.PRIMARY}/></center></div> :
        <Tree contents={x}
        onNodeClick={this.handleNodeClick}/>
      }
    </div>
    <AnchorButton text="New Task" iconName="add" className="pt-intent-primary pt-fill" onClick={this.onCreateClicked}/>
      <CreateNewTaskDialogComponent
        isOpen={this.state.dialogOpen}
        onCancel={this.onDialogCancel}
      />
      </div>
    )
  }
});
module.exports = TaskListView;
