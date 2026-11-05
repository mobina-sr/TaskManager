import { taskForm, taskInput, taskDate, themeToggle } from "./elements.js";
import { addTask, restoreTasks } from "./task.js";
import "./sidebar.js";
import "./modal.js";
import { initTimer } from "./timer.js";

restoreTasks();
initTimer();

// ----------------------------------------------------------
// form

const today = new Date().toLocaleDateString("en-CA");

taskDate.min = today;
taskDate.value = today;

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  addTask(taskText, taskDate.value);
  taskInput.value = "";
  taskDate.value = today;
});

// ----------------------------------------------------------
// dark mode

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  const isDarkMode = document.body.classList.contains("dark-mode");

  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}
