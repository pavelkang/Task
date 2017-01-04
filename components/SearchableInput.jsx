import {
    Classes,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    IconContents,
    InputGroup,
    Keys,
    Menu,
    Popover,
    Position,
} from "@blueprintjs/core";
var classNames = require("classnames");
import { filter } from "fuzzaldrin-plus";

const SearchableInput = React.createClass({

  getInitialState() {
    return {
      query: "",
      selectedIndex: 0,
      users: this.props.users,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.users != this.state.users) {
      this.setState({
        query: "",
        selectedIndex: 0,
        users: nextProps.users,
      })
    }
  },

  getMatches() {
    var filteredNames = filter(this.state.users, this.state.query, {
      key: "displayName"
    });
    return filteredNames;
  },

  handleResultHover(e) {
    e.preventDefault();
    const el = e.currentTarget
    const selectedIndex = Array.prototype.indexOf.call(el.parentElement.children, el);
    this.setState({
      selectedIndex: selectedIndex,
    });
  },

  onItemClick(id) {
    /*
    e.preventDefault();
    const el = e.currentTarget;
    console.log(el);
    const selectedIndex = Array.prototype.indexOf.call(el.parentElement.children, el);
    this.props.onItemClick(selectedIndex);*/

    return (e) => {
      e.preventDefault();
      this.props.onItemClick(id);
    }

  },

  renderPopover() {
    const matches = this.getMatches();
    const selectedIndex = Math.min(matches.length-1, this.state.selectedIndex);
    if (matches.length === 0) {
      var items = [
      <a className={classNames(Classes.MENU_ITEM, Classes.DISABLED)} key="none">
          No results. Press <code>esc</code> to reset.
      </a>,
      ];
    } else {
      var items = matches.map(
        (o, index) => {
          const classes = classNames(Classes.MENU_ITEM, Classes.POPOVER_DISMISS,{
                [Classes.ACTIVE]: index === selectedIndex,
            });
            var id = this.props.getUniqueId(o);
          return (
            <a
              className={classes}
              key={id}
              onMouseEnter={this.handleResultHover}
              onClick={this.onItemClick(id)}
              >
                <div>{this.props.getDisplayName(o)}</div>
              </a>
          );
      }
      );
    }
    return <Menu>{items}</Menu>
  },

  handlePopoverInteraction(nextOpenState) {
    if (!nextOpenState) {
      this.setState({
        query: "",
        selectedIndex: 0,
      });
    }
  },

  handleSetSearchInputRef(ref) {
    this.inputRef = ref;
  },

  handleKeyDown(e) {

    switch(e.keyCode) {
      case 40: // down key
        e.preventDefault();
        this.selectNext(1);
        break;
      case 38: // up key
        e.preventDefault();
        this.selectNext(-1);
        break;
    }
  },

  selectNext(direction) {
    var newIndex = this.state.selectedIndex + direction;
    newIndex = Math.max(0, newIndex);
    this.setState({selectedIndex: newIndex});
  },

  handleQueryChange(e) {
      this.setState({
        query: e.target.value,
      }, () => {
        this.setState({
          selectedIndex: 0,
        });
      });
  },

  render() {
    return (
      <Popover
                      autoFocus={false}
                      enforceFocus={false}
                      className="docs-navigator"
                      content={this.renderPopover()}
                      onInteraction={this.handlePopoverInteraction}
                      inline={true}
                      isOpen={this.state.query.length > 0}
                      popoverClassName={Classes.MINIMAL}
                      position={Position.BOTTOM_LEFT}
                  >
                      <InputGroup
                          autoFocus={true}
                          inputRef={this.handleSetSearchInputRef}
                          leftIconName="search"
                          onChange={this.handleQueryChange}
                          onKeyDown={this.handleKeyDown}
                          placeholder="Search..."
                          type="search"
                          value={this.state.query}
                      />
      </Popover>
    );
  }
});

module.exports = SearchableInput;
