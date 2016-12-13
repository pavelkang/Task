import {EventEmitter} from "events";
import dispatcher from "./Dispatcher.js";

var DATA = {
  "name" : "Kai Kang",
  "tasks" : [
    {
      "id": 0,
      "title": "Make this app",
      "intro": "Make it really good",
      "duedate": null,
      "owner": {
        "id": 0,
        "name": "Kai Kang",
      },
      "subscribers": ["kai", "abby", "bob", "chris"],
      "widgets": [0],
      "todos": [
        {
          "content": "build basic interface",
          "done": true,
        },
        {
          "content": "Add complete task button, and dialog, save system",
          "done": false,
        },
        {
          "content": "add Subscribers with mention system",
          "done": false,
        },
        {
          "content": "implement when2meet",
          "done": false
        },
        {
          "content": "add Owner",
          "done": true,
        },
        {
          "content": "add depends on, build task tree system, isSelected",
          "done": false,
        },
        {
          "content": "build widget system",
          "done": true,
        },
        {
          "content": "add organization system",
          "done": false,
        },
        {
          "content": "optional: add notifications",
          "done": false,
        }
      ]
    },
    {
      "id": 1,
      "title": "Prepare for 16-423",
      "intro": "learn some iOS programming",
      "duedate": null,
      "owner": {
        "id": 0,
        "name": "Kai Kang",
      },
      "subscribers": [0],
      "widgets": [0, 1],
      "todos": [
        {
          "content": "ask prof. about idea",
          "done": false,
        }
      ]
    },
    {
      "id": 2,
      "title": "Practice more guitar",
      "intro": "practice strumming part",
      "duedate": null,
      "owner": {
        "id": 0,
        "name": "Kai Kang",
      },
      "subscribers": [0],
      "widgets": [0, 1, 2, 3, 4, 5],
      "todos": [],
    },
    {
      "id": 3,
      "title": "Buy stuff",
      "intro": "practice strumming part",
      "duedate": null,
      "owner": {
        "id": 0,
        "name": "Kai Kang",
      },
      "subscribers": [0],
      "widgets": [0],
      "todos": [],
    }
  ]
};

function populateTask(key, title, userid, username, org) {
  return {
    'id': key,
    'title': title,
    'intro': "",
    'owner': username,
    'blocks': [],
    'dependson': [],
    'subscribers': [],
    'widgets': [],
    'duedate': '',
    'organization': org,
  };
};

function getUserOrRedirect() {
  return {
    'uid': 42,
    'displayName': 'Kai Kang',
  }
}

const widgets = [
    {
      "id": 0,
      "name": "Todo List",
      "key": "todos",
    },
    {
      "id": 1,
      "name": "Comment box",
      "key": "commentbox",
    },
    {
      "id": 2,
      "name": "Votes",
      "key": "votes",
    },
    {
      "id": 3,
      "name": "Rich Text Editor",
      "key": "richtexteditor",
    },
    {
      "id": 4,
      "name": "Attachments",
      "key": "attachments",
    },
    {
      "id": 5,
      "name": "When2meet",
      "key": "whentomeet",
    }
  ]

class TaskStore extends EventEmitter {
  constructor() {
    super();
    window.addEventListener('load', function() {
      // TODO: no sign-in for now
      this.taskRef = firebase.database().ref("users/42");
      //this.taskRef.set(DATA);
      // initialize this.tasks
      this.taskRef.once('value').then(function(snapshot) {
        this.data = snapshot.val();
        this.emit("change:task");
      }.bind(this));
      // add listeners
      // if anything changes, reload the entire task list
        this.taskRef.on('value', function(snapshot) {
          this.data = snapshot.val();
          console.log(this.data);
          this.emit("change:task");
        }.bind(this))
      /*
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
      // signed in
      this.taskRef = firebase.database().ref('users/' + user.uid + '/tasks/');
      // initialize this.tasks
      this.taskRef.once('value').then(function(snapshot) {
        this.data = obj2list(snapshot.val());
        this.emit("change:task");
      }.bind(this));
      // add listeners
      // if anything changes, reload the entire task list
        this.taskRef.on('value', function(snapshot) {
          this.data = obj2list(snapshot.val());
          this.emit("change:task");
        }.bind(this))
      }
    }.bind(this))*/
    }.bind(this))
    this.data = null;
    this.selectedTask = null;
  }

  _selectTask(task) {
    this.selectedTask = this.data.tasks[task.id];
    this.emit("change:selectedTask");
  }

  _updateTask(task) {
    var updates = {};
    var newData = task.task;
    newData['owner'] = task.owner ? task.owner : "";
    newData['intro'] = task.intro;
    newData['duedate'] = task.duedate ? task.duedate : new Date();
    newData['widgets'] = task.widgets ? task.widgets : [];
    _.each(task.child_data, function(value, key) {
      newData[key] = value;
    });
    // TODO fix here
    updates[task.id] = newData;
    var p = firebase.database().ref('users/42/tasks/').update(updates);
    p.then(function() {
      firebase.database().ref('users/42/').once("value").then(function(snapshot){
          this.data = snapshot.val();
          this.emit("change:saved");
      }.bind(this));
    }.bind(this));
  }

  _finishTask(task) {
    var refToDelete = firebase.database().ref('tasks/id/' + task.id);
    var p = refToDelete.remove();
    this.selectedTask = null;
    this.emit("change:all");
  }

  _createTask(task) {
    // task:
    // {title, user}
    var user = getUserOrRedirect();
    var refToAdd = firebase.database().ref('users/'+user.uid+"/tasks/");
    var newPostRef = refToAdd.push();
    var key = newPostRef.key;
    var p = newPostRef.set(
      populateTask(key, task.title, user.uid, user.displayName, 'Carnegie Mellon University')
    );
    p.then(function() {
      firebase.database().ref('users/'+user.uid).once("value").then(function(snapshot){
          this.data = snapshot.val();
          // select the created task
          this.selectedTask = _.find(this.data.tasks, {'id': key});
          this.emit("change:created");
      }.bind(this));
    }.bind(this));
  }

  _deleteTask(task) {
    // task {id}
    var user = getUserOrRedirect();
    var refToDelete = firebase.database().ref('users/'+user.uid+"/tasks/"+task.id);
    var p = refToDelete.remove();
    p.then(function() {
      firebase.database().ref('users/'+user.uid).once("value").then(function(snapshot){
          this.data = snapshot.val();
          this.selectedTask = null;
          this.emit("change:deleted");
      }.bind(this));
    }.bind(this))
  }

  getData() {
    return this.data;
  }

  getCurrentTask() {
    return this.selectedTask;
  }

  getAllWidgets() {
    return widgets;
  }

  getCurrentUser() {
    return getUserOrRedirect();
  }

  handleActions(action) {
    switch(action.type) {
      case "SELECT_TASK":
        this._selectTask(action.task);
        break;
      case "UPDATE_TASK":
        this._updateTask(action.task);
        break;
      case "FINISH_TASK":
        this._finishTask(action.task);
        break;
      case "CREATE_TASK":
        this._createTask(action.task);
        break;
      case "DELETE_TASK":
        this._deleteTask(action.task);
        break;
    }
  }

}

const taskStore = new TaskStore;
dispatcher.register(taskStore.handleActions.bind(taskStore));
export default taskStore;
