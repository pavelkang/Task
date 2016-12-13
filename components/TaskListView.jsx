import { Tree, Classes, AnchorButton, Spinner, Intent} from "@blueprintjs/core";
import * as TaskAction from "../actions/TaskAction.js";
import CreateNewTaskDialogComponent from "./CreateNewTaskDialogComponent";

const VIEWTYPE_OWN = 0;
const VIEWTYPE_SUBSCRIBE = 1;

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
        dislogOpen: false,
        viewType: VIEWTYPE_OWN,
      });
    }
  },

  getInitialState() {
    return {
      dialogOpen: false,
      data: this.props.data,
      tasks: this.props.data ? _.values(this.props.data.tasks) : [],
      viewType: VIEWTYPE_OWN,
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

  onViewTypeChange(evt) {
    this.setState({
      viewType: parseInt(evt.target.value),
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
    <div>
      <center>
      <label className="pt-label pt-inline">
        View Tasks
        <div className="pt-select">
          <select onChange={this.onViewTypeChange} value={this.state.viewType}>
            <option value="1">Owned</option>
          <option value="2">Subscribed</option>
          </select>
        </div>
    </label>
    </center>
      <AnchorButton text="New Task" iconName="add" className="pt-intent-primary pt-fill" onClick={this.onCreateClicked}/>
        <CreateNewTaskDialogComponent
          isOpen={this.state.dialogOpen}
          onCancel={this.onDialogCancel}
        />
    </div>
      </div>
    )
  }
});
module.exports = TaskListView;
