import {InputGroup, AnchorButton, Collapse, Intent} from "@blueprintjs/core";
import WidgetToggleOpenButton from "./WidgetToggleOpenButton";

const WidgetVote = React.createClass({

  getInitialState() {
    return {
      isOpen: true,
    }
  },

  componentWillReceiveProps(nextProps) {
  },

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  },

  render() {
    return(
      <div className="taskwidget">
        <nav className="pt-navbar widgetbar">
          <div className="pt-navbar-group pt-align-left">
            <AnchorButton className="pt-button pt-minimal pt-intent-primary pt-navbar-heading" iconName="alignment-bottom" text="Votes" intent={Intent.PRIMARY}></AnchorButton>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <WidgetToggleOpenButton toggleopen={this.toggleOpen} isOpen={this.state.isOpen}/>
            <button className="pt-button pt-minimal pt-icon-cross"></button>
          </div>
        </nav>
        <Collapse isOpen={this.state.isOpen}>
          votes
        </Collapse>
      </div>
    )
  }
});
module.exports = WidgetVote;
