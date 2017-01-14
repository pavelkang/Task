import { EditableText, AnchorButton, Popover, PopoverInteractionKind, Intent,
  Position, Tooltip, RadioGroup, Radio, Checkbox, Alert,
  Button, Toaster, Dialog, InputGroup} from "@blueprintjs/core";
import TaskStore from "../stores/TaskStore.js";
import WidgetTodoList from "./WidgetTodoList";
import WidgetCommentBox from "./WidgetCommentBox";
import WidgetVote from "./WidgetVote";
import WidgetRichTextEditor from "./WidgetRichTextEditor";
import WidgetAttachments from "./WidgetAttachments";
import WidgetWhenToMeet from "./WidgetWhenToMeet";
import * as TaskAction from "../actions/TaskAction.js";
import NonIdealNoTaskSelectedComponent from "./NonIdealNoTaskSelectedComponent";
import DueDateInput from "./DueDateInput.jsx";
import SubscribersInput from "./SubscribersInput.jsx";

const NO_FOLDER = "";

function isIn(list, item) {
  var ind = _.find(list, (it) => {
      return it === item;
  });
  if (ind) {
    return true;
  } else {
    return false;
  }
}

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

  const donetasknamestyle = {
    paddingTop: '15px',
    color: '#0D8050',
  }

const TaskMainView = React.createClass({

  getInitialState() {
    this._unsaved_widgets = this.props.task ? this.props.task.widgets : [];
    return {
      task: this.props.task,
      userdata: this.props.userdata,
      unsaved_intro: this.props.task ? (this.props.task.intro ? this.props.task.intro : "") : "",
      unsaved_duedate: this.props.task ? this.props.task.duedate : null,
      unsaved_widgets: this.props.task ? (this.props.task.widgets ? this.props.task.widgets : []) : [],
      unsaved_subscribers: this.props.task ? (this.props.task.subscribers ? this.props.task.subscribers : []) : [],
      unsaved_folders: this.props.userdata ? (this.props.userdata.folders ? this.props.userdata.folders : []) : [],
      unsaved_folder: this.props.task ? (this.props.task.folder ? this.props.task.folder: ""): "",
      unsaved_folder_input: "",
      unsaved_child_data: {},
      allWidgets: TaskStore.getAllWidgets(),
      changeNotSaved: false,
      isFolderSelectOpen: false,
    }
  },

  // need to update component?
  componentWillReceiveProps(nextProps) {
    if ((nextProps.task !== this.state.task) ||
        (nextProps.userdata !== this.state.userdata)) {
      this._unsaved_widgets = nextProps.task ? nextProps.task.widgets : [];
      this.setState({
        task: nextProps.task,
        userdata: nextProps.userdata,
        unsaved_intro: nextProps.task ? (nextProps.task.intro ? nextProps.task.intro : "") : "",
        unsaved_duedate: nextProps.task ? nextProps.task.duedate : null,
        unsaved_widgets: nextProps.task ? (nextProps.task.widgets ? nextProps.task.widgets : []) : [],
        unsaved_subscribers: nextProps.task ? (nextProps.task.subscribers ? nextProps.task.subscribers : []) : [],
        unsaved_folders: nextProps.userdata ? (nextProps.userdata.folders ? nextProps.userdata.folders : []) : [],
        unsaved_folder: nextProps.task ? (nextProps.task.folder ? nextProps.task.folder : "") : "",
        unsaved_folder_input: "",
        unsaved_child_data: {},
        allWidgets: TaskStore.getAllWidgets(),
        changeNotSaved: false,
        isFolderSelectOpen: false,
      });
    }
  },

  componentDidMount() {
    TaskStore.on("change:saved", () => {
      this.setState({
        changeNotSaved: false,
      });
    });
  },

  _update(k, v) {
    TaskAction.updateTask({
      id: this.state.task.id,
      key: k,
      value: v,
    });
  },

  _updateUser(k, v) {
    TaskAction.updateUser({
      key: k,
      value: v,
    })
  },

  onIntroChange(s) {
    if (s === this.state.unsaved_intro) {
      return ;
    }
    this.setState({
      unsaved_intro: s,
      changeNotSaved: true,
    }, () => { // auto save
      this._update('intro', s);
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
      this._update('duedate', d);
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
        this._update('widgets', this._unsaved_widgets);
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

  onReopen(evt) {
    this.setState({
      openReopenAlert : true,
    });
  },

  onReopenConfirm(evt) {
      TaskAction.reopenTask({
        'id': this.state.task.id,
      });
      this.setState({
        openReopenAlert: false,
      });
  },

  onReopenCancel(evt) {
    this.setState({
      openReopenAlert: false,
    });
  },

  onSubscribersChange(newSubscribers) {
    this.setState({
      changeNotSaved: true,
      unsaved_subscribers: newSubscribers,
    }, () => {
      this._update("subscribers", newSubscribers);
    }); // auto save
  },

  onChildUpdate(key, value) {
    var newChildData = this.state.unsaved_child_data;
    newChildData[key] = value;
    this.setState({
      changeNotSaved: true,
      unsaved_child_data: newChildData,
    }, () => {
      this._update(key, value);
    }); // auto save
  },

  componentWillMount() {
    TaskStore.on("change:saved", () => {
      this.setState({
        changeNotSaved: false,
      });
    });
  },

  onFolderChange(e) {
    this.setState({
      unsaved_folder_input: e.target.value,
    });
  },

  onFolderKeyUp(e) {
    if (e.keyCode === 13) { // might be a bug when onFolderChange hasn't finished
      if (this.state.unsaved_folder_input === "") {
        return ;
      }
      if (!isIn(this.state.unsaved_folders, this.state.unsaved_folder_input)) {
        var folder = this.state.unsaved_folder_input;
        var newFolders = this.state.unsaved_folders;
        newFolders.push(this.state.unsaved_folder_input);
        this.setState({
          changeNotSaved: true,
          unsaved_folders: newFolders,
          unsaved_folder_input: "",
          unsaved_folder: folder,
        }, () => {
          this._update("folder", folder);
          this._updateUser("folders", newFolders);
        });
      } else {
      }
    }
  },

  onFolderClick(folder) {
    this.setState({
      changeNotSaved: true,
      unsaved_folder: folder,
      isFolderSelectOpen: false,
    }, () => {
      this._update("folder", folder);
    })
  },

  openFolderSelect() {
    this.setState({
      isFolderSelectOpen: true,
    })
  },

  onFolderInteraction(nextOpenState){
    this.setState({
      isFolderSelectOpen: nextOpenState,
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

    let addToFolderContent = (
      <div>
        <h5>Add to folder:</h5>
        {
          (this.state.unsaved_folders ? this.state.unsaved_folders : []).map((folder, idx) => {
            return (
              <div key={idx}>
                <AnchorButton className="pt-minimal pt-fill" iconName="symbol-circle" text={folder} onClick={this.onFolderClick.bind(this, folder)}/>
              </div>
            )
          })
        }
        <hr/>
        <InputGroup placeholder="Hit enter to add a new category"
          value={this.state.unsaved_folder_input}
          onChange={this.onFolderChange}
          onKeyUp={this.onFolderKeyUp} leftIconName="key-enter"/>
      </div>
    );

    return (
      <div>
          <div style={this.props.style} className="pt-card pt-elevation-1">
            <div style={taskheaderstyle}>
              <center>
                {
                  this.state.task.done ?
                  <h1 style={donetasknamestyle} id="my-tasktitle">{this.state.task.title + ' [Done]'}</h1> :
                  <h1 style={tasknamestyle} id="my-tasktitle">{this.state.task.title}</h1>
                }
                <Tooltip content="Owner of this task" position={Position.TOP}>
                  <span className="pt-button pt-minimal pt-icon-person">{this.state.task.owner}</span>
                </Tooltip>
                <span className="pt-navbar-divider subtaskheader"></span>
                <DueDateInput duedate={this.state.unsaved_duedate} onChange={this.onDueDateChange}/>
                <span className="pt-navbar-divider subtaskheader"></span>
                <Popover content={addToFolderContent}
                         isOpen={this.state.isFolderSelectOpen}
                         onInteraction={this.onFolderInteraction}
                         popoverClassName="pt-popover-content-sizing"
                         position={Position.BOTTOM}
                         className="pt-fill">
                <button className="pt-button pt-minimal pt-icon-folder-open" onClick={this.openFolderSelect}>{this.state.unsaved_folder}</button>
              </Popover>
              </center>
            </div>
            <div style={buttonstyle}>
              <span>{this.state.changeNotSaved ? 'Saving...' : 'Saved'}</span>
              {
                this.state.task.done ?
                (
                  <span style={okbuttonstyle}>
                    <AnchorButton text="Reopen" iconName="tick" className="pt-intent-primary" onClick={this.onReopen}/>
                  </span>
                ) :
                (
                  <span style={okbuttonstyle}>
                    <AnchorButton text="OK  " iconName="tick" className="pt-intent-success" onClick={this.onFinish}/>
                  </span>
                )
              }
              <span>
              <AnchorButton text="Delete" iconName="trash" className="pt-intent-danger" onClick={this.onDelete}/>
              </span>
            </div>
            {/*
            <SubscribersInput
              subscribers={this.state.task.subscribers}
              onSubscribersChange={this.onSubscribersChange}
            /> */}
            <div className="taskbasics">
            <EditableText multiline minLines={3} maxLines={12}
              placeholder={"Say more about this task..."}
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
                    <WidgetCommentBox updateParent={this.onChildUpdate} comments={this.state.task.comments}/>
                  </div>
                );
                case 2:
                return(
                  <div key={idx}>
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
            <p>Mark this task as finished?</p>
          </Alert>
          <Alert onCancel={this.onReopenCancel} cancelButtonText="Cancel" confirmButtonText="Ok !" intent={Intent.PRIMARY} isOpen={this.state.openReopenAlert ? this.state.openReopenAlert : false} onConfirm={this.onReopenConfirm}>
            <p>Reopen this task?</p>
          </Alert>
          <Alert onCancel={this.onDeleteCancel} cancelButtonText="Cancel" confirmButtonText="Delete!" intent={Intent.DANGER} isOpen={this.state.openDeleteAlert ? this.state.openDeleteAlert : false} onConfirm={this.onDeleteConfirm}>
            <p>Are you sure you want to delete this task? This operation is not revertible.</p>
          </Alert>
        </div>
    );
  },
});
module.exports = TaskMainView;
