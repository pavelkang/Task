import {Checkbox, InputGroup, Button, AnchorButton, Intent,
        Collapse, Position, Popover, Menu, MenuItem, MenuDivider,
      PopoverInteractionKind} from "@blueprintjs/core";
import NonIdealEmptyTodoComponent from "./NonIdealEmptyTodoComponent";
import TaskStore from "../stores/TaskStore.js";
import TodoItemComponent from "./TodoItemComponent";
import WidgetToggleOpenButton from "./widgetToggleOpenButton";
import WidgetBar from "./WidgetBar.jsx";

const WidgetTodoList = React.createClass({
  getInitialState() {
    return {
      data: this.props.data,
      todos: this.props.todos ? this.props.todos : [],
      todo: "",
      isOpen: true,
    }
  },

  // need to update component?
  componentWillReceiveProps(nextProps) {
    if (nextProps.todos !==  this.state.todos) {
      this.setState({
        data: nextProps.data,
        todos: nextProps.todos ? nextProps.todos : [],
        todo: this.state.todo,
        isOpen: true,
      });
      var todoList = document.getElementById('todocontent');
      if (todoList) {todoList.scrollTop = todoList.scrollHeight;}
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

  render() {
    var ideal = (this.state.todos && this.state.todos.length > 0)
    var todos =  ideal ?
    <div className="widgetcontent" id="todocontent">
        {
          this.state.todos.map(function(todo, idx) {
            return(
              <TodoItemComponent key={idx} value={idx} label={todo.content} checked={todo.done} onChange={this.onCheckTodo} onDelete={this.onTodoDelete}/>
            )
          }.bind(this))
        }
    </div>
    :
    <NonIdealEmptyTodoComponent />;
    var content = (
    <div>
      {todos}
      <InputGroup placeholder="Hit enter to add new todo"
        value={this.state.todo}
        onChange={this.onTodoChange}
        onKeyUp={this.onKeyUp} leftIconName="key-enter"/>
    </div>)

      return(
        <div className="taskwidget">
          <WidgetBar iconName="property" title="Todo List"
            content={content}
          />
        </div>
      );
  }
});
module.exports = WidgetTodoList;
