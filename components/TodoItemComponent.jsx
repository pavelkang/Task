import {Checkbox, Button} from "@blueprintjs/core";

const TodoItemComponent = React.createClass({

  getInitialState() {
    return({
      showDelete: false,
    });
  },

  onHover() {
    this.setState({
      showDelete: true,
    })
  },

  onLeave() {
    this.setState({
      showDelete: false,
    });
  },

  onDelete() {
    this.props.onDelete(this.props.value);
  },

  render() {
    return(
      <div className="my-todoitem-outer" onMouseOver={this.onHover} onMouseLeave={this.onLeave}>
        <div className="my-todoitem-inner">
        <Checkbox value={this.props.value} label={this.props.label} checked={this.props.checked} className="pt-intent-success pt-inline myinline" onChange={this.props.onChange}/>
        {
          this.state.showDelete ?
          <Button iconName="trash" className="pt-minimal pt-inline myinline tododelte" onClick={this.onDelete}></Button>
          : <div></div>
        }
        </div>
      </div>
    )
  }
});
module.exports = TodoItemComponent;
