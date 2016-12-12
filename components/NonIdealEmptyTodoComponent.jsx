import {NonIdealState} from "@blueprintjs/core";

const NonIdealEmptyTodoComponent = React.createClass({
  render() {
    return(
        <center>
        <NonIdealState className="nonidea-emptytodo" title="No TODO right now" visual="folder-open" description="Create a new todo below!"/>
        </center>
    )
  }
});
module.exports = NonIdealEmptyTodoComponent;
