import {InputGroup} from "@blueprintjs/core";
import {Timeline, TimelineEvent} from "react-event-timeline";
import WidgetBar from "./WidgetBar.jsx";
import NonIdealCommentComponent from "./NonIdealCommentComponent.jsx";
import TaskStore from "../stores/TaskStore.js";

const WidgetCommentBox = React.createClass({

  getInitialState() {
    return {
      comments: this.props.comments ? this.props.comments : [],
      comment: ""
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.comments !==  this.state.comments) {
      this.setState({
        comments: nextProps.comments ? nextProps.comments : [],
        comment: this.state.comment,
        isOpen: true,
      });
      var commentList = document.getElementById('commentcontent');
      if (commentList) {commentList.scrollTop = commentList.scrollHeight;}
    }
  },

  updateParent() {
    this.props.updateParent(
      "comments",
      this.state.comments,
    );
  },

  onCommentChange(e) {
    this.setState({
      comment: e.target.value,
    })
  },

  onKeyUp(e) {
    if (e.keyCode === 13) {
      if (this.state.comment.length === 0) {
        return ;
      }
      var newComments = this.state.comments;
      newComments.push({
        'content': this.state.comment,
        'createdAt': new Date(),
        'author': TaskStore.getCurrentUser(),
      });
      this.setState({
        comments: newComments,
        comment: "",
      }, () => {
        this.updateParent();
        var commentList = document.getElementById('commentcontent');
        if (commentList) {commentList.scrollTop = commentList.scrollHeight;}
      });
    }
  },

  render() {

    var ideal = (this.state.comments && this.state.comments.length > 0);
    var comments = ideal ?
    <div id="commentcontent" className="widgetcontent">
      <Timeline >
      {
        this.state.comments.map(function(comment, idx) {
          if (comment.createdAt && comment.content) {
          return(
            <TimelineEvent key={idx} title=""
              createdAt={comment.createdAt.toString().substring(0,10)}>
              {comment.content}
            </TimelineEvent>
          )
          }
        }.bind(this))
      }
      </Timeline>
    </div> :
    <NonIdealCommentComponent />;
    var content =
    <div>
      {comments}
      <InputGroup placeholder="Hit enter to add new comment"
        value={this.state.comment} onChange={this.onCommentChange}
        onKeyUp={this.onKeyUp} leftIconName="comment"/>
    </div>
    return(
      <div className="taskwidget">
        <WidgetBar iconName="comment" title="Comments"
          content={content}
        />
      </div>
    )
  }
});
module.exports = WidgetCommentBox;
