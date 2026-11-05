import { todoList, progressList, doneList } from "./elements.js";

const STORAGE_KEY = "tasks";

const lists = {
  todo: todoList,
  progress: progressList,
  done: doneList,
};

export const saveTasks = function () {
  const tasks = [];

  Object.entries(lists).forEach(function ([status, list]) {
    list.querySelectorAll("li").forEach(function (task) {
      tasks.push({
        title: task.querySelector(".task-info span").textContent,
        date: task.dataset.date,
        description: task.dataset.description || "",
        subtasks: JSON.parse(task.dataset.subtasks || "[]"),
        status,
      });
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const loadTasks = function () {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};
