import {Checkbox, InputGroup, Button, AnchorButton, Intent,
        Collapse, Position, Popover, Menu, MenuItem, MenuDivider,
      PopoverInteractionKind} from "@blueprintjs/core";
import NonIdealEmptyTodoComponent from "./NonIdealEmptyTodoComponent";
import TaskStore from "../stores/TaskStore.js";
import TodoItemComponent from "./TodoItemComponent";
import WidgetToggleOpenButton from "./widgetToggleOpenButton";

const titlestyle = {
    position : 'absolute',
    right: '50px',
}

const WidgetTodoList = React.createClass({
  getInitialState() {
    return {
      data: this.props.data,
      todos: this.props.todos ? this.props.todos : [],
      allWidgets: TaskStore.getAllWidgets(),
      todo: "",
      isOpen: true,
    }
  },

  // need to update component?
  componentWillReceiveProps(nextProps) {
    if (nextProps.todos != this.state.todos) {
      this.setState({
        data: nextProps.data,
        todos: nextProps.todos ? nextProps.todos : [],
        allWidgets: TaskStore.getAllWidgets(),
        todo: this.state.todo,
        isOpen: true,
      });
    }
  },

  updateParent() {
    this.props.updateParent(
      "todos",
      this.state.todos,
    );
  },

  onCheckTodo(e) {
    var newTodos = this.state.todos;
    newTodos[e.target.value].done = !newTodos[e.target.value].done;
    this.setState({
      todos: newTodos,
    }, this.updateParent);
  },

  onTodoDelete(v) {
    var newTodos = this.state.todos;
    newTodos.splice(v, 1); // remove the vth todo
    this.setState({
      todos: newTodos,
    }, this.updateParent);
  },

  onTodoChange(e) {
    this.setState({
      todo: e.target.value,
    });
  },

  onKeyUp(e) {
    if (e.keyCode === 13) {
      if (this.state.todo.length === 0) {
        return ;
      }
      var newTodos = this.state.todos;
      newTodos.push({
        'content': this.state.todo,
        'done': false,
      });
      this.setState({
        todos: newTodos,
        todo: "",
      }, () => {
        this.updateParent();
        var todoList = document.getElementById('todocontent');
        if (todoList) {todoList.scrollTop = todoList.scrollHeight;}
      });
    }
  },

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  },

  render() {

    const toolsMenu = (
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



    var defaultEmpty = (
      <div className="taskwidget">
        <nav className="pt-navbar widgetbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">Todo List</div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-cross"></button>
          </div>
        </nav>
        <NonIdealEmptyTodoComponent />
        <InputGroup placeholder="Hit enter to add new todo" value={this.state.todo} onChange={this.onTodoChange} onKeyUp={this.onKeyUp} leftIconName="key-enter"/>
      </div>);
    if (this.state.todos && this.state.todos.length > 0) {
      return(
        <div className="taskwidget">
          <nav className="pt-navbar widgetbar">
            <div className="pt-navbar-group pt-align-left">
              <AnchorButton className="pt-button pt-minimal pt-intent-primary pt-navbar-heading" iconName="property" text="Todo List" intent={Intent.PRIMARY}></AnchorButton>
            </div>
            <div className="pt-navbar-group pt-align-right">
              <Popover content={toolsMenu}
                     interactionKind={PopoverInteractionKind.CLICK}
                     position={Position.LEFT_TOP}
                     useSmartPositioning={true}>
                     <button className="pt-button pt-minimal pt-icon-wrench"></button>
              </Popover>
              <WidgetToggleOpenButton toggleopen={this.toggleOpen} isOpen={this.state.isOpen}/>
              <button className="pt-button pt-minimal pt-icon-cross"></button>
            </div>
          </nav>
          <Collapse isOpen={this.state.isOpen}>
          <div className="widgetcontent" id="todocontent">
              {
                this.state.todos.map(function(todo, idx) {
                  return(
                    <TodoItemComponent key={idx} value={idx} label={todo.content} checked={todo.done} onChange={this.onCheckTodo} onDelete={this.onTodoDelete}/>
                  )
                }.bind(this))
              }
          </div>
          <InputGroup placeholder="Hit enter to add new todo" value={this.state.todo} onChange={this.onTodoChange} onKeyUp={this.onKeyUp} leftIconName="key-enter"/>
          </Collapse>
        </div>
      )
    } else {
      return defaultEmpty;
    }
  }
});
module.exports = WidgetTodoList;
