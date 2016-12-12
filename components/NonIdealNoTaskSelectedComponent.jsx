import {NonIdealState} from "@blueprintjs/core";

const NonIdealNoTaskSelectedComponent = React.createClass({
  render() {
    return(
        <center>
        <NonIdealState className="nonideal-notaskselected" title="No Task Selected" visual="search" description="Select or create a new task on the left!"/>
        </center>
    )
  }
});
module.exports = NonIdealNoTaskSelectedComponent;
