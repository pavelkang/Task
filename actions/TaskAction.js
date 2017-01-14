import dispatcher from '../stores/Dispatcher.js';

export function selectTask(task) {
  dispatcher.dispatch({
    type: "SELECT_TASK",
    task: task,
  });
}

export function updateTask(task) {
  dispatcher.dispatch({
    type: "UPDATE_TASK",
    task: task,
  });
}

export function finishTask(task) {
  dispatcher.dispatch({
    type: "FINISH_TASK",
    task: task,
  });
}

export function reopenTask(task) {
  dispatcher.dispatch({
    type: "REOPEN_TASK",
    task: task,
  })
}

export function createTask(task) {
  dispatcher.dispatch({
    type: "CREATE_TASK",
    task: task,
  });
}

export function deleteTask(task) {
  dispatcher.dispatch({
    type: "DELETE_TASK",
    task: task,
  })
}

// IMPROVETHIS: MOVE TO UserAction.js
export function updateUser(info) {
  dispatcher.dispatch({
    type: "UPDATE_USER",
    info: info,
  });
}
