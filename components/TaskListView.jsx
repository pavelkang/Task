import { Tree, Classes, AnchorButton, Spinner, Intent} from "@blueprintjs/core";
import * as TaskAction from "../actions/TaskAction.js";
import CreateNewTaskDialogComponent from "./CreateNewTaskDialogComponent";

const VIEWTYPE_OWN = 0;
const VIEWTYPE_SUBSCRIBE = 1;
const SECS_PER_DAY = 86400000;

/*
  Create a different icon based on urgency of the task
*/
function getIconName(task) {
  if (task.done !== null) {
    if (task.done === true) {
      return "tick";
    }
  }
  var taskDateStr = task.duedate;
  if (!taskDateStr) {
    return "time";
  }
  var taskDate = new Date(taskDateStr);
  var today = new Date()
  var diffInDay = (taskDate - today) / SECS_PER_DAY;
  if (diffInDay < 0) {
    // past due Date
    return "warning-sign";
  } else if (diffInDay < 1.5) {
    // soon
    return "eye-open"
  }
  return "box";
}

function sortTasksByDate(taskA, taskB) {
  if (!taskB.duedate) {
    return -1;
  } else {
    if (taskA.duedate) {
      var a = new Date(taskA.duedate);
      var b = new Date(taskB.duedate);
      if (a === b) {
        if (taskA.title < taskB.title) {
          //TODO : bug, not sorted alphabetically
          return -1;
        } else {
          return 1;
        }
      }
      return a - b;
    } else {
      return 1;
    }
  }
}

const TaskListView = React.createClass({

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.state.data) {
      var tasks = nextProps.data ? _.values(nextProps.data.tasks) : [];
      var tree = this.constructTree(tasks, nextProps.userdata);
      this.setState({
        data: nextProps.data,
        tasks: tasks,
        dialogOpen: false,
        tree: tree,
        userdata: nextProps.userdata,
        viewType: VIEWTYPE_OWN,
      });
    }
  },

  getInitialState() {
    var tasks = this.props.data ? _.values(this.props.data.tasks) : [];
    var tree = this.constructTree(tasks, this.props.userdata);
    return {
      dialogOpen: false,
      data: this.props.data,
      tasks: tasks,
      tree: tree,
      userdata: this.props.userdata,
      viewType: VIEWTYPE_OWN,
    }
  },

  handleNodeExpand(nodeData) {
    nodeData.isExpanded = true;
    nodeData.iconName = 'folder-open';
    this.setState(this.state);
  },

  handleNodeCollapse(nodeData) {
    nodeData.isExpanded = false;
    nodeData.iconName = 'folder-close';
    this.setState(this.state);
  },

  isTaskNode(node) {
    return node.depth === 1;
  },

  handleNodeClick(nodeData, _nodePath, e) {
    if (this.isTaskNode(nodeData)) { // task node
      TaskAction.selectTask({
        'id': nodeData.key,
      });
      var prevSelected = nodeData.isSelected;
      // de-select all nodes
      var tree = this.state.tree;
      for (var i = 0; i < tree.length; i++) {
        for (var j = 0; j < tree[i].childNodes.length; j++) {
          var oldTaskNode = tree[i].childNodes[j];
          oldTaskNode.isSelected = false;
          tree[i].childNodes[j] = oldTaskNode;
        }
      }
      nodeData.isSelected = prevSelected === null ? true : !prevSelected;
      this.setState({
        tree: tree,
      })
    }
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

  constructTree(tasks, userdata) {
    if (!userdata) {
      return [];
    }
    var contents = [];
    var l = userdata.folders ? userdata.folders.length : 0;
    for (var i = 0; i < l; i++) {
      var folderName = userdata.folders[i];
      var tasksInThisFolder = _.where(tasks, {
        folder: folderName,
      });
      var children = _.map(tasksInThisFolder, (task, j) => {
          return {
            key: task.id,
            depth: 1,
            label: task.title,
            iconName: getIconName(task),
            path: [i, j],
            id: task.id,
          }
      });
      children.sort(sortTasksByDate);
      contents.push({
        depth: 0,
        id: i,
        label: folderName,
        path: [i],
        childNodes: children,
        isExpanded: true,
        iconName: 'folder-open',
      });
    }
    // Uncategorized
    var noFolderTasks = [];
    for (var j = 0; j < tasks.length; j++) {
      var task = tasks[j];
      if (!task.folder) {
        noFolderTasks.push({
          key: task.id,
          depth: 1,
          label: task.title,
          iconName: getIconName(task),
          path:[i,j],
          id: task.id,
        });
      }
    };
    if (noFolderTasks.length === 0) {
      return contents;
    }
    noFolderTasks.sort(sortTasksByDate);
    contents.push({
      depth: 0,
      id: l,
      label: "Uncategorized",
      path: [l],
      childNodes: noFolderTasks,
      isExpanded: true,
      iconName: 'folder-open',
    });
    return contents;
  },

  render() {
    return (
      <div style={this.props.style}>
      <div>
      {
        this.state.data === null ?
        <div id="tasklistspinner"><center><Spinner intent={Intent.PRIMARY}/></center></div> :
        <Tree
          contents={this.state.tree}
          onNodeClick={this.handleNodeClick}
          onNodeCollapse={this.handleNodeCollapse}
          onNodeExpand={this.handleNodeExpand}/>
      }
    </div>
    <div>
      {/*
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
  */}
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
