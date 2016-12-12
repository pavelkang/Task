import {Checkbox, InputGroup, Button, AnchorButton, Intent} from "@blueprintjs/core";
import NonIdealEmptyTodoComponent from "./NonIdealEmptyTodoComponent";
import TaskStore from "../stores/TaskStore.js";
import TodoItemComponent from "./TodoItemComponent";

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
              <button className="pt-button pt-minimal pt-icon-more"></button>
              <button className="pt-button pt-minimal pt-icon-small-minus"></button>
              <button className="pt-button pt-minimal pt-icon-cross"></button>
            </div>
          </nav>
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
        </div>
      )
    } else {
      return defaultEmpty;
    }
  }
});
module.exports = WidgetTodoList;
