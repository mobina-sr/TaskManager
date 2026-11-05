import {
  todoList,
  progressList,
  doneList,
  columns,
  deleteIcon,
  progressIcon,
  doneIcon,
} from "./elements.js";
import { saveTasks, loadTasks } from "./storage.js";

// ----------------------------------------------------------
// task actions

const deleteTask = function (task) {
  task.remove();
  saveTasks();
};

const moveToTodo = function (task, taskTitle) {
  taskTitle.classList.remove("completed");
  todoList.append(task);
  saveTasks();
};

const moveToProgress = function (task, taskTitle) {
  taskTitle.classList.remove("completed");
  progressList.append(task);
  saveTasks();
};

const moveToDone = function (task, taskTitle) {
  taskTitle.classList.add("completed");
  doneList.append(task);
  saveTasks();
};

// ----------------------------------------------------------
// drag and drop

let draggedTask = null;

const getDragAfterElement = function (container, y) {
  const elements = [...container.querySelectorAll("li:not(.dragging)")];

  return elements.reduce(
    function (closest, child) {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }

      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null },
  ).element;
};

const makeDraggable = function (task) {
  task.draggable = true;

  task.addEventListener("dragstart", function () {
    draggedTask = task;
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", function () {
    draggedTask = null;
    task.classList.remove("dragging");
  });
};

const dropTask = function (column) {
  if (!draggedTask) return;

  const taskTitle = draggedTask.querySelector(".task-info span");

  if (column.classList.contains("todo-column")) {
    taskTitle.classList.remove("completed");
  }

  if (column.classList.contains("progress-column")) {
    taskTitle.classList.remove("completed");
  }

  if (column.classList.contains("done-column")) {
    taskTitle.classList.add("completed");
  }

  saveTasks();
};

columns.forEach(function (column) {
  const list = column.querySelector(".task-list");

  column.addEventListener("dragover", function (e) {
    e.preventDefault();

    if (!draggedTask) return;

    const afterElement = getDragAfterElement(list, e.clientY);

    if (afterElement === null) {
      list.append(draggedTask);
    } else {
      list.insertBefore(draggedTask, afterElement);
    }
  });

  column.addEventListener("drop", function (e) {
    e.preventDefault();
    dropTask(column);
  });
});

// ----------------------------------------------------------
// button functions

const createButton = function (className, icon) {
  const button = document.createElement("button");
  button.classList.add(className);
  button.innerHTML = icon;
  return button;
};

const createTaskActions = function (task, taskTitle) {
  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  const deleteBtn = createButton("delete-btn", deleteIcon);
  const progressBtn = createButton("progress-btn", progressIcon);
  const doneBtn = createButton("done-btn", doneIcon);

  deleteBtn.addEventListener("click", function () {
    deleteTask(task);
  });

  progressBtn.addEventListener("click", function () {
    moveToProgress(task, taskTitle);
  });

  doneBtn.addEventListener("click", function () {
    moveToDone(task, taskTitle);
  });

  taskActions.append(progressBtn, doneBtn, deleteBtn);
  return taskActions;
};

// ----------------------------------------------------------
// create task

const createTask = function (taskText, date, description = "", subtasks = []) {
  const task = document.createElement("li");

  task.dataset.date = date;
  task.dataset.description = description;
  task.dataset.subtasks = JSON.stringify(subtasks);

  makeDraggable(task);

  const taskTitle = document.createElement("span");
  taskTitle.textContent = taskText;

  const taskActions = createTaskActions(task, taskTitle);

  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");

  taskInfo.append(taskTitle);

  if (date) {
    const dateElement = document.createElement("small");
    dateElement.classList.add("task-due-date");

    const today = new Date().toLocaleDateString("en-CA");

    if (date < today) {
      dateElement.style.color = "#d97979";
    }

    dateElement.textContent = date;

    taskInfo.append(dateElement);
  }

  task.append(taskInfo, taskActions);
  return task;
};

//------------------------------------------------

export const addTask = function (taskText, date) {
  const task = createTask(taskText, date);
  todoList.append(task);
  saveTasks();
};

//------------------------------------------------

const lists = { todo: todoList, progress: progressList, done: doneList };

export const restoreTasks = function () {
  loadTasks().forEach(function ({
    title,
    date,
    status,
    description,
    subtasks,
  }) {
    const task = createTask(title, date, description, subtasks);
    lists[status].append(task);

    if (status === "done") {
      task.querySelector(".task-info span").classList.add("completed");
    }
  });
};
