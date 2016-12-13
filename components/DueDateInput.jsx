import {DateInput} from "@blueprintjs/datetime";
import {Position, Popover, PopoverInteractionKind} from "@blueprintjs/core";

const DueDateInput = React.createClass({

  getInitialState() {
    return({
      newDueDate: null,
    });
  },

  setNewDueDate(d) {
    this.props.onChange(d);
  },


  render() {

    var popoverContent = (
      <DateInput value={new Date()} onChange={this.setNewDueDate}></DateInput>
    );

    var setDueDateComponent = (
      <Popover content={popoverContent}
               interactionKind={PopoverInteractionKind.HOVER}
               position={Position.BOTTOM}
               useSmartPositioning={true}>
               <span className="pt-button pt-minimal pt-icon-calendar">Set due date now!</span>
      </Popover>
    );

    return(
      <span>
        {
          (this.props.duedate === "") ?
          setDueDateComponent :
          <DateInput
            value={new Date(this.props.duedate)}
            onChange={this.props.onChange}
          />
        }
      </span>

    );
  }
});
module.exports = DueDateInput;
