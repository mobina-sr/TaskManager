import {
  board,
  sidebar,
  sidebarToggle,
  allTasksLink,
  todayLink,
  completedLink,
} from "./elements.js";

// ----------------------------------------------------------
// open - close

const app = sidebar.closest(".app");
const mobileQuery = window.matchMedia("(max-width: 980px)");

const isSidebarOpen = function () {
  return mobileQuery.matches
    ? app.classList.contains("sidebar-open")
    : !app.classList.contains("sidebar-collapsed");
};

const updateToggle = function () {
  sidebarToggle.setAttribute("aria-expanded", isSidebarOpen());
};

const toggleSidebar = function () {
  app.classList.toggle(
    mobileQuery.matches ? "sidebar-open" : "sidebar-collapsed",
  );
  updateToggle();
};

const closeMobileSidebar = function () {
  if (!mobileQuery.matches) return;
  app.classList.remove("sidebar-open");
  updateToggle();
};

sidebarToggle.addEventListener("click", toggleSidebar);
mobileQuery.addEventListener("change", updateToggle);
updateToggle();

// ----------------------------------------------------------
// date

const getTodayDate = function () {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ----------------------------------------------------------
// views

const clearTodayFilter = function () {
  const tasks = document.querySelectorAll(".task-list li");

  tasks.forEach(function (task) {
    task.classList.remove("not-today");
  });
};

const showAllTasks = function () {
  board.classList.remove("completed-view");
  clearTodayFilter();
};

const showTodayTasks = function () {
  board.classList.remove("completed-view");

  const today = getTodayDate();
  const tasks = document.querySelectorAll(".task-list li");

  tasks.forEach(function (task) {
    task.classList.toggle("not-today", task.dataset.date !== today);
  });
};

const showCompletedTasks = function () {
  board.classList.add("completed-view");
  clearTodayFilter();
};

// ----------------------------------------------------------
// events

allTasksLink.addEventListener("click", function (e) {
  e.preventDefault();
  showAllTasks();
});

todayLink.addEventListener("click", function (e) {
  e.preventDefault();
  showTodayTasks();
});

completedLink.addEventListener("click", function (e) {
  e.preventDefault();
  showCompletedTasks();
});
