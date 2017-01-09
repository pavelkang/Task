import {EventEmitter} from "events";
import dispatcher from "./Dispatcher.js";
var wilddog = require("wilddog");

var config = {
  syncURL: "https://taskkk.wilddogio.com"
};
wilddog.initializeApp(config);
var IN_CHINA = true;

function getTaskRef(uid, taskId) {
  if (IN_CHINA) {
    return wilddog.sync().ref('users/'+uid+"/tasks/"+taskId);
  } else {
    return firebase.database().ref('users/'+uid+"/tasks/"+taskId);
  }
}

function getUserRef(uid) {
  if (IN_CHINA) {
    return wilddog.sync().ref('users/'+uid);
  } else {
    return firebase.database().ref('users/'+uid)
  }
}

function getAllUsersRef() {
  if (IN_CHINA) {
    return wilddog.sync().ref('allusers/');
  } else {
    return firebase.database().ref("allusers/");
  }
}

function getUserOrRedirect() {
  return {
    'uid': 42,
    'displayName': 'Kai Kang',
  }
}

function getUserOrNull() {
  return {
    'uid': 42,
    'displayName': 'Kai Kang',
  }
}

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
      //this.taskRef = firebase.database().ref("users/42");
      this.taskRef = getUserRef(42);
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
          // modify selected task
          if (this.selectedTask) {
              var selectedId = this.selectedTask.id;
              var newSelectedTask = _.find(this.data.tasks, {id: selectedId});
              if (newSelectedTask) {
                this.selectedTask = newSelectedTask;
              }
          }
          this.emit("change:task");
        }.bind(this));

        var allUsersRef = getAllUsersRef();

        allUsersRef.once('value', function(snapshot) {
          this.allUsers = snapshot.val();
          this.emit("user:allusers");
        }.bind(this));
        // user data
        allUsersRef.on('value', function(snapshot) {
          this.allUsers = snapshot.val();
          this.emit("user:allusers");
        }.bind(this));
    }.bind(this))
    this.data = null;
    this.selectedTask = null;
    this.allUsers = [];
  }

  _selectTask(task) {
    this.selectedTask = this.data.tasks[task.id];
    this.emit("change:selectedTask");
  }

  _updateTask(task) {
    var updates = {};
    updates[task.key] = task.value;
    var taskRef = getTaskRef(42, task.id);
    var p = taskRef.update(updates);
    p.then(() => {
      // TODO change saving... to saved here
      this.emit("change:saved");
    });
    /*
    var newData = {
      title: task.title,
      id: task.id,
      owner: task.owner ? task.owner : "",
      intro: task.intro,
      duedate: task.duedate ? task.duedate : new Date(),
      widgets: task.widgets ? task.widgets : [],
      subscribers: task.subscribers ? task.subscribers : [],
      organization: task.organization ? task.organization : "Public",
    };
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
    */
  }

  _finishTask(task) {
    var user = getUserOrRedirect();
    var ref = getTaskRef(user.uid, task.id);
    var updates = {};
    updates['done'] = true;
    var p = ref.update(updates);
    p.then(() => {
        this.emit("change:all");
    });    
  }

  _createTask(task) {
    // task:
    // {title, user}
    var user = getUserOrRedirect();
    //var refToAdd = firebase.database().ref('users/'+user.uid+"/tasks/");
    var refToAdd = wilddog.sync().ref('users/'+user.uid+"/tasks/");
    var newPostRef = refToAdd.push();
    if (IN_CHINA) {
      var key = newPostRef.path.A[3];
    } else {
      var key = newPostRef.key;
    }
    var p = newPostRef.set(
      populateTask(key, task.title, user.uid, user.displayName, 'Carnegie Mellon University')
    );
    p.then(function() {
      var userRef = getUserRef(user.uid);
      userRef.once("value").then(function(snapshot){
          this.data = snapshot.val();
          // select the created task
          this.selectedTask = _.find(this.data.tasks, {'id': key});
          this.emit("change:created");
      }.bind(this));
      /*
      firebase.database().ref('users/'+user.uid).once("value").then(function(snapshot){
          this.data = snapshot.val();
          // select the created task
          this.selectedTask = _.find(this.data.tasks, {'id': key});
          this.emit("change:created");
      }.bind(this));
      */
    }.bind(this));
  }

  _deleteTask(task) {
    // task {id}
    var user = getUserOrRedirect();
    var refToDelete = getTaskRef(user.uid, task.id);
    var p = refToDelete.remove();
    // TODO: we can just listen to user/tasks and update taskListView
    p.then(function() {
      var userRef = getUserRef(user.uid);
      userRef.once("value").then(function(snapshot){
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

  getAllUsers() {
    return this.allUsers;
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
