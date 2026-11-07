import { todoList, progressList, doneList } from "./elements.js";

const updateTaskProgress = function () {
  const todoTasks = [...todoList.querySelectorAll("li")];
  const progressTasks = [...progressList.querySelectorAll("li")];
  const doneTasks = [...doneList.querySelectorAll("li")];

  const todoCount = todoTasks.length;
  const progressCount = progressTasks.length;
  const doneCount = doneTasks.length;

  const totalCount = todoCount + progressCount + doneCount;

  const percentage = totalCount
    ? Math.round((doneCount / totalCount) * 100)
    : 0;

  const today = new Date().toLocaleDateString("en-CA");

  const overdueCount = [...todoTasks, ...progressTasks].filter(
    (task) => task.dataset.date && task.dataset.date < today,
  ).length;

  document.querySelector(".completed-count").textContent = doneCount;
  document.querySelector(".total-count").textContent = totalCount;
  document.querySelector(".progress-percentage").textContent = `${percentage}%`;

  document.querySelector(".todo-count").textContent = todoCount;
  document.querySelector(".in-progress-count").textContent = progressCount;
  document.querySelector(".done-count").textContent = doneCount;
  document.querySelector(".overdue-count").textContent = overdueCount;

  document.querySelector(".todo-progress").style.width =
    `${(todoCount / (totalCount || 1)) * 100}%`;

  document.querySelector(".in-progress-progress").style.width =
    `${(progressCount / (totalCount || 1)) * 100}%`;

  document.querySelector(".done-progress").style.width =
    `${(doneCount / (totalCount || 1)) * 100}%`;
};

export const initTaskProgress = function () {
  updateTaskProgress();

  const observer = new MutationObserver(updateTaskProgress);

  [todoList, progressList, doneList].forEach(function (list) {
    observer.observe(list, {
      childList: true,
      attributes: true,
      attributeFilter: ["data-date"],
    });
  });
};
