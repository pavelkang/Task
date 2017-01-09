import {AnchorButton, Intent, Collapse} from "@blueprintjs/core";
import WidgetToggleOpenButton from "./widgetToggleOpenButton";

const WidgetBar = React.createClass({

  getInitialState() {
    return {
      isOpen: true,
    }
  },

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  },

  render() {
    return(
      <div>
      <nav className="pt-navbar widgetbar">
        <div className="pt-navbar-group pt-align-left">
          <AnchorButton className="pt-button pt-minimal pt-intent-primary pt-navbar-heading"
            iconName={this.props.iconName}
            text={this.props.title} intent={Intent.PRIMARY}></AnchorButton>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <WidgetToggleOpenButton toggleopen={this.toggleOpen} isOpen={this.state.isOpen}/>
          <button className="pt-button pt-minimal pt-icon-cross"></button>
        </div>
      </nav>
      <Collapse isOpen={this.state.isOpen}>
      {this.props.content}
      </Collapse>
      </div>
    )
  }
});
module.exports = WidgetBar;
