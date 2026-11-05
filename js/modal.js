import {
  board,
  taskModal,
  closeModalBtn,
  editTaskTitle,
  saveTaskBtn,
  editTaskDescription,
  subtaskList,
  subtaskInput,
  addSubtaskBtn,
  deleteIcon,
} from "./elements.js";
import { saveTasks } from "./storage.js";

let currentTask = null;

//---------------------------------------

const createSubtask = function (text, completed = false) {
  const subtask = document.createElement("div");
  subtask.classList.add("subtask-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  const title = document.createElement("span");
  title.textContent = text;
  title.classList.toggle("completed", completed);

  checkbox.addEventListener("change", function () {
    title.classList.toggle("completed", checkbox.checked);
  });

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.classList.add("delete-btn");
  removeBtn.setAttribute("aria-label", "Delete subtask");
  removeBtn.innerHTML = deleteIcon;

  removeBtn.addEventListener("click", function () {
    subtask.remove();
  });

  subtask.append(checkbox, title, removeBtn);
  subtaskList.append(subtask);
};

const addSubtask = function () {
  const text = subtaskInput.value.trim();
  if (!text) return;

  createSubtask(text);
  subtaskInput.value = "";
  subtaskInput.focus();
};

addSubtaskBtn.addEventListener("click", addSubtask);
subtaskInput.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  e.preventDefault();
  addSubtask();
});

//---------------------------------------
// Open modal
const openTaskModal = function (task) {
  currentTask = task;

  editTaskTitle.value = task.querySelector(".task-info span").textContent;
  editTaskDescription.value = task.dataset.description;
  subtaskInput.value = "";
  subtaskList.innerHTML = "";

  JSON.parse(task.dataset.subtasks).forEach(function (item) {
    createSubtask(item.text, item.completed);
  });

  taskModal.style.display = "flex";
  editTaskTitle.focus();
};

const closeModal = function () {
  taskModal.style.display = "none";
  currentTask = null;
};

//---------------------------------------
// Click on task

board.addEventListener("click", function (e) {
  const task = e.target.closest(".task-list li");

  if (!task) return;
  if (e.target.closest("button")) return;

  openTaskModal(task);
});

//---------------------------------------
// close modal

closeModalBtn.addEventListener("click", closeModal);

taskModal.addEventListener("click", function (e) {
  if (e.target === taskModal) closeModal();
});

//---------------------------------------
// Save changes

saveTaskBtn.addEventListener("click", function () {
  if (!currentTask) return;

  const title = editTaskTitle.value.trim();

  if (!title) {
    editTaskTitle.focus();
    return;
  }

  addSubtask();

  currentTask.querySelector(".task-info span").textContent = title;
  currentTask.dataset.description = editTaskDescription.value.trim();

  const subtasks = [];

  subtaskList.querySelectorAll(".subtask-item").forEach(function (item) {
    subtasks.push({
      text: item.querySelector("span").textContent,
      completed: item.querySelector("input").checked,
    });
  });

  currentTask.dataset.subtasks = JSON.stringify(subtasks);
  saveTasks();
  closeModal();
});
