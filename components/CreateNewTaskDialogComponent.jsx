import {Dialog, InputGroup, Button, Intent} from "@blueprintjs/core";
import * as TaskAction from "../actions/TaskAction.js";

const CreateNewTaskDialogComponent = React.createClass({

  onCreate() {
    // TODO check empty name
    // CHANGE THIS uid
    TaskAction.createTask({
      'title': this.state.title,
      'userid': "42",
      'username': "Kai Kang",
    });
    this.state.title = "";
    this.props.onCancel();
  },

  getInitialState() {
    return({
      title: "",
    });
  },

  componentDidMount() {
  },

  onTitleChange(e) {
      this.setState({
        title: e.target.value,
      });
  },

  onKeyUp(e) {
      if (e.keyCode === 13) {
        this.onCreate();
      }
  },

  render() {
    return (
      <Dialog
            iconName="inbox"
            isOpen={this.props.isOpen}
            onClose={this.props.onCancel}
            title="Create A New Task">
          <div className="pt-dialog-body">
              <h3>New Task Name:</h3>
              <InputGroup label="Name:" value={this.state.title} onChange={this.onTitleChange} autoFocus onKeyUp={this.onKeyUp}/>
              
          </div>
          <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
          <Button text="Cancel" onClick={this.props.onCancel}/>
        <Button intent={Intent.PRIMARY} onClick={this.onCreate} text="Create !" />
        </div>
        </div>
      </Dialog>
    )
  }
});

module.exports = CreateNewTaskDialogComponent;
