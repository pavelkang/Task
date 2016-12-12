import {InputGroup} from "@blueprintjs/core";
const WidgetCommentBox = React.createClass({
  render() {
    return(
      <div>
        <nav className="pt-navbar widgetbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">Comment Box</div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-cross"></button>
          </div>
        </nav>
        comments
      </div>
    )
  }
});
module.exports = WidgetCommentBox;
