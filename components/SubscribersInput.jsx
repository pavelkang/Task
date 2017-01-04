import {InputGroup, Tag, Intent, Popover, PopoverInteractionKind, Position,
  Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import TaskStore from "../stores/TaskStore.js";
import SearchableInput from "./SearchableInput.jsx";

function getUidList(userlist) {
  if (!userlist) {
    return [];
  }
  return _.map(userlist, (user) => {
      return user.uid;
  });
}

function getDisplayName(o) {
  return o.displayName;
}

function getUid(o) {
  return o.id;
}

const SubscribersInput = React.createClass({

  getInitialState() {
    return({
      value: "",
      users: TaskStore.getAllUsers(),
      subscribers: this.props.subscribers ? this.props.subscribers : [],
      isHintOpen: false,
    })
  },

    componentWillReceiveProps(nextProps) {
      if (nextProps.subscribers != this.state.subscribers) {
        this.setState({
          value: "",
          users: TaskStore.getAllUsers(),
          subscribers: nextProps.subscribers ? nextProps.subscribers : [],
          isHintOpen: false,
        })
      }
    },

  componentWillMount() {
  },

  componentDidMount() {
    TaskStore.on('user:allusers', () => {
      var newAllUsers = TaskStore.getAllUsers();
      if (newAllUsers != this.state.users) {
        this.setState({
            users: newAllUsers,
        });
      }
    })
  },

  onFocus() {
    this.setState({
      isHintOpen: true,
    })
  },

  onBlur() {
    this.setState({
        isHintOpen: false,
    });
  },

  onSubscribe(uid) {
    console.log("subscribe", uid);
    var newSubscriber = { id: uid };
    var newSubscribers = this.state.subscribers;
    newSubscribers.push(newSubscriber);
    this.props.onSubscribersChange(newSubscribers);
  },

  onSubscriberRemove(id) {
    return (e) => {
      e.preventDefault();
      var newSubscribers = _.reject(this.state.subscribers, (o) => {
        return o.id === id;
      });
      this.props.onSubscribersChange(newSubscribers);
    }
  },

  renderSubscriberTag(item, idx) {
      var _id = item.id;
      var targetUser = _.find(this.state.users, {'id': _id});
      if (!targetUser) {
        return (<div key={_id}></div>)
      }
      return (
        <Tag key={_id} intent={Intent.PRIMARY} onRemove={this.onSubscriberRemove(_id)} >
          {targetUser.displayName}
        </Tag>
      );
  },

  render() {

    var subscribers = this.props.subscribers ? this.props.subscribers : [];

    return(
        <div>
        <label className="pt-label pt-inline">
          Subscribers:
          <span>
          {
              subscribers.map(this.renderSubscriberTag)
          }
          </span>
          <SearchableInput
            users={this.state.users}
            getUniqueId={getUid}
            getDisplayName={getDisplayName}
            onItemClick={this.onSubscribe}
          />
        </label>
        </div>
    );
  }
});
module.exports = SubscribersInput;
