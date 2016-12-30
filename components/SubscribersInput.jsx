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
        console.log(newAllUsers);
      if (newAllUsers != this.state.users) {
        this.setState(
          users: newAllUsers,
        );
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
    console.log(uid);
  },

  onUnsubscribe(x) {

  },

  renderSubscriberTag(item, idx) {
      // item: {uid: xx}
      var _id = item.uid;
      var targetUser = _.find(this.state.users, {'id': _id});
      if (!targetUser) {
        return (<div key={idx}></div>)
      }
      return (
        <Tag key={idx} intent={Intent.PRIMARY} onRemove={this.onUnsubscribe} >
          {targetUser.displayName}
        </Tag>
      );
  },

  render() {

    let userHintMenu = (
      <Menu>
                <MenuItem
                    iconName="new-text-box"
                    onClick={this.handleClick}
                    text="New text box" />
                <MenuItem
                    iconName="new-object"
                    onClick={this.handleClick}
                    text="New object" />
                <MenuItem
                    iconName="new-link"
                    onClick={this.handleClick}
                    text="New link" />
                <MenuDivider />
                <MenuItem text="Settings..." iconName="cog" />
    </Menu>
    );

    return(
        <div>
        <label className="pt-label pt-inline">
          Subscribers:
          <span>
          {
              this.state.subscribers.map(this.renderSubscriberTag)
          }
          </span>
          <SearchableInput
            users={this.state.users}
            getUniqueId={getUid}
            getDisplayName={getDisplayName}
            onSubscribe={this.onSubscribe}
          />
        </label>
        </div>
    );
  }
});
module.exports = SubscribersInput;
