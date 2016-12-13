import { EditableText, AnchorButton, Popover, PopoverInteractionKind, Intent,
  Position, Tooltip, RadioGroup, Radio, Checkbox, Alert,
  Button, Toaster} from "@blueprintjs/core";
import TaskStore from "../stores/TaskStore.js";
import WidgetTodoList from "./WidgetTodoList";
import WidgetCommentBox from "./WidgetCommentBox";
import WidgetVote from "./WidgetVote";
import WidgetRichTextEditor from "./WidgetRichTextEditor";
import WidgetAttachments from "./WidgetAttachments";
import WidgetWhenToMeet from "./WidgetWhenToMeet";
import * as TaskAction from "../actions/TaskAction.js";
import NonIdealNoTaskSelectedComponent from "./NonIdealNoTaskSelectedComponent";
import DueDateInput from "./DueDateInput";

const OurToaster = Toaster.create({
  position: Position.TOP,
    iconName: 'tick',
    timeout: 2000,
});

  const buttonstyle = {
    position: 'absolute',
    right: '20px',
    top: '100px',
  }

  const okbuttonstyle = {
    paddingLeft: '10px',
    paddingRight: '5px',
  }

  const taskheaderstyle = {
  }

const tasknamestyle = {
  paddingTop: '15px',
}


const TaskMainView = React.createClass({

  getInitialState() {
    this._unsaved_widgets = this.props.task ? this.props.task.widgets : [];
    return {
      data: this.props.data,
      task: this.props.task,
      unsaved_intro: this.props.task ? (this.props.task.intro ? this.props.task.intro : "") : "",
      unsaved_duedate: this.props.task ? this.props.task.duedate : null,
      unsaved_widgets: this.props.task ? (this.props.task.widgets ? this.props.task.widgets : []) : [],
      unsaved_child_data: {},
      allWidgets: TaskStore.getAllWidgets(),
      changeNotSaved: false,
    }
  },

  // need to update component?
  componentWillReceiveProps(nextProps) {
    if ((nextProps.data != this.state.data)
    || (nextProps.task != this.state.task)) {
      if (nextProps && nextProps.task && this.state.task) {
      }
      this._unsaved_widgets = nextProps.task ? nextProps.task.widgets : [];
      this.setState({
        data: nextProps.data,
        task: nextProps.task,
        unsaved_intro: nextProps.task ? (nextProps.task.intro ? nextProps.task.intro : "") : "",
        unsaved_duedate: nextProps.task ? nextProps.task.duedate : null,
        unsaved_widgets: nextProps.task ? (nextProps.task.widgets ? nextProps.task.widgets : []) : [],
        unsaved_child_data: {},
        allWidgets: TaskStore.getAllWidgets(),
        changeNotSaved: false,
      });
    }
  },

  onIntroChange(s) {
    if (s === this.state.unsaved_intro) {
      return ;
    }
    this.setState({
      unsaved_intro: s,
      changeNotSaved: true,
    }, () => { // auto save
      this._save();
    });
  },

  onDueDateChange(d) {
    if (d === this.state.unsaved_duedate) {
      return ;
    }
    this.setState({
      unsaved_duedate: d,
      changeNotSaved: true,
    }, () => {
      this._save();
    });
  },

  onWidgetChange(evt) {
    if (evt.target.checked) { // add
      var newWidget = parseInt(evt.target.value);
      var smaller = _.filter(this._unsaved_widgets, (i) => {return i < newWidget});
      var bigger = _.filter(this._unsaved_widgets, (i) => {return i > newWidget});
      this._unsaved_widgets = smaller.concat([newWidget].concat(bigger));
    } else { // remove
      var newWidget = parseInt(evt.target.value);
      this._unsaved_widgets = _.filter(this._unsaved_widgets, (i) => {return i != newWidget});
    }
  },

  onWidgetClose(evt) {
    if (this._unsaved_widgets === this.state.task.widgets) {
      return ;
    }
    this.setState({
      unsaved_widgets: this._unsaved_widgets,
      changeNotSaved: true,
    }, () => { // auto save
        this._save();
    });
  },

  onDelete(evt) {
    this.setState({
      openDeleteAlert: true,
    })
  },

  onDeleteConfirm(evt) {
    TaskAction.deleteTask({
      'id': this.state.task.id,
    });
    this.setState({
      openDeleteAlert: false,
    });
  },

  onDeleteCancel(evt) {
    this.setState({
      openDeleteAlert: false,
    })
  },

  onFinish(evt) {
    this.setState({
      openFinishAlert : true,
    });
  },

  onFinishConfirm(evt) {
      TaskAction.finishTask({
        'id': this.state.task.id,
      });
      this.setState({
        openFinishAlert: false,
      });
  },

  onFinishCancel(evt) {
    this.setState({
      openFinishAlert: false,
    });
  },

  onChildUpdate(key, value) {
    var newChildData = this.state.unsaved_child_data;
    newChildData[key] = value;
    this.setState({
      changeNotSaved: true,
      unsaved_child_data: newChildData,
    }, () => { // auto save
      this._save();
    });
  },

  _save() {
    TaskAction.updateTask({
      'id': this.state.task.id,
      'task': this.state.task,
      'intro': this.state.unsaved_intro,
      'duedate': this.state.unsaved_duedate,
      'widgets': this.state.unsaved_widgets,
      'child_data': this.state.unsaved_child_data,
      'owner': 'Kai Kang', // TODO
    });
  },

  componentWillMount() {
    TaskStore.on("change:saved", () => {
      this.setState({
        changeNotSaved: false,
      });
    });
  },

  render() {
    if (!this.state.task) {
      return <NonIdealNoTaskSelectedComponent />
    }
      let popoverContent = (
        <div>
          <h5>Add widgets from ...</h5>
          {
            (this.state.allWidgets? this.state.allWidgets : []).map(function (widget, idx) {
              if (this.state.unsaved_widgets.indexOf(widget.id) !== -1) {
                return ;
              }
              return (
                <Checkbox label={widget.name} key={widget.id} onChange={this.onWidgetChange} value={widget.id}/>
              )
            }.bind(this))
          }
    <center>
                  <button className="pt-button pt-popover-dismiss" >Add Now!</button>
  </center>
              </div>
          );

    return (
      <div>
          <div style={this.props.style} className="pt-card pt-elevation-1">
            <div style={taskheaderstyle}>
              <center>
                <h1 style={tasknamestyle} id="my-tasktitle">{this.state.task.title}</h1>
                <Tooltip content="Owner of this task" position={Position.TOP}>
                  <span className="pt-button pt-minimal pt-icon-person">{this.state.task.owner}</span>
                </Tooltip>
                <span className="pt-navbar-divider subtaskheader"></span>
                <DueDateInput duedate={this.state.unsaved_duedate} onChange={this.onDueDateChange}/>
                <span className="pt-navbar-divider subtaskheader"></span>
                <button className="pt-button pt-minimal pt-icon-globe">{this.state.task.organization}</button>
              </center>

            </div>
            <div style={buttonstyle}>
              <span>{this.state.changeNotSaved ? 'Saving...' : 'Saved'}</span>
              <span style={okbuttonstyle}>
              <AnchorButton text="OK  " iconName="tick" className="pt-intent-success" onClick={this.onFinish}/>
              </span>
              <span>
              <AnchorButton text="Delete" iconName="trash" className="pt-intent-danger" onClick={this.onDelete}/>
              </span>
            </div>
            <div className="taskbasics">
            <EditableText multiline minLines={3} maxLines={12}
              placeholder={"Say more about this task"}
              value={this.state.unsaved_intro}
              onChange={this.onIntroChange}
            />
            </div>
          {
            this.state.unsaved_widgets.map((widgetId, idx) => {
              switch(widgetId) {
                case 0:
                return (
                  <div key={idx}>
                    <WidgetTodoList updateParent={this.onChildUpdate} data={this.state.data} todos={this.state.task.todos}/>
                  </div>
                );
                case 1:
                return (
                  <div key={idx}>
                    <WidgetCommentBox />
                  </div>
                );
                case 2:
                return(
                  <div key={idx}>
                    <hr />
                    <WidgetVote />
                  </div>
                );
                case 3:
                return (
                  <div key={idx}>
                    <hr />
                    <WidgetRichTextEditor />
                  </div>
                );
                case 4:
                return (
                  <div key={idx}>
                    <hr />
                    <WidgetAttachments />
                  </div>
                );
                case 5:
                return (
                  <div key={idx}>
                    <hr />
                    <WidgetWhenToMeet />
                  </div>
                );
              }
          })
        }
          <center>
          <Popover content={popoverContent}
                   interactionKind={PopoverInteractionKind.CLICK}
                   popoverClassName="pt-popover-content-sizing"
                   position={Position.TOP}
                   useSmartPositioning={true}
                   onClose={this.onWidgetClose}
                   className="pt-fill">
              <AnchorButton iconName="add" text="Add more widgets" className="pt-fill pt-intent-primary" id="addwidgetbutton"/>
          </Popover>
        </center>
          </div>
          <Alert onCancel={this.onFinishCancel} cancelButtonText="Cancel" confirmButtonText="Ok !" intent={Intent.SUCCESS} isOpen={this.state.openFinishAlert ? this.state.openFinishAlert : false} onConfirm={this.onFinishConfirm}>
            <p>Finished? This operation will delete this task forever.</p>
          </Alert>
          <Alert onCancel={this.onDeleteCancel} cancelButtonText="Cancel" confirmButtonText="Delete!" intent={Intent.DANGER} isOpen={this.state.openDeleteAlert ? this.state.openDeleteAlert : false} onConfirm={this.onDeleteConfirm}>
            <p>Are you sure you want to delete this task? This operation is not revertible.</p>
          </Alert>
        </div>
    );
  }
});
module.exports = TaskMainView;
