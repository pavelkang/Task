import {NonIdealState} from "@blueprintjs/core";

const NonIdealCommentComponent = React.createClass({
  render() {
    return(
        <center>
        <NonIdealState className="nonidea-emptytodo" title="No comments right now" visual="folder-open" description="Create a new comment below!"/>
        </center>
    )
  }
});
module.exports = NonIdealCommentComponent;
