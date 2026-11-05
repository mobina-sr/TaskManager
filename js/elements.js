// ----------------------------------------------------------
// elements

export const taskForm = document.querySelector(".task-form");
export const taskInput = document.querySelector(".task-input");
export const taskDate = document.querySelector(".task-date");

export const todoList = document.querySelector(".todo-column .task-list");
export const doneList = document.querySelector(".done-column .task-list");
export const progressList = document.querySelector(
  ".progress-column .task-list",
);

export const board = document.querySelector(".board");
export const doneColumn = document.querySelector(".done-column");
export const columns = document.querySelectorAll(".task-column");

export const sidebar = document.querySelector(".sidebar");
export const sidebarToggle = document.querySelector(".sidebar-toggle");
export const allTasksLink = document.querySelector(".all-tasks-link");
export const todayLink = document.querySelector(".today-link");
export const completedLink = document.querySelector(".completed-link");

export const taskModal = document.querySelector(".task-modal-overlay");
export const closeModalBtn = document.querySelector(".close-modal");
export const editTaskTitle = document.querySelector(".edit-task-title");
export const saveTaskBtn = document.querySelector(".save-task-btn");
export const editTaskDescription = document.querySelector(
  ".edit-task-description",
);

export const subtaskList = document.querySelector(".subtask-list");
export const subtaskInput = document.querySelector(".subtask-input");
export const addSubtaskBtn = document.querySelector(".add-subtask-btn");

export const timerDisplay = document.querySelector(".timer-display");
export const startTimerBtn = document.querySelector(".start-timer");
export const resetTimerBtn = document.querySelector(".reset-timer");

export const reportBtn = document.querySelector(".report-btn");
export const reportModal = document.querySelector(".report-modal-overlay");
export const closeReportModalBtn = document.querySelector(
  ".close-report-modal",
);

export const dailyReportList = document.querySelector(".daily-report-list");
export const weeklyTotalTime = document.querySelector(".weekly-total-time");

export const themeToggle = document.querySelector(".theme-toggle");

// ----------------------------------------------------------
// icons

export const deleteIcon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </svg>
`;

export const progressIcon = `
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width="18"
     height="18"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round"
     class="lucide lucide-loader preview-icon"
   >
     <path d="M12 2v4" />
     <path d="m16.2 7.8 2.9-2.9" />
     <path d="M18 12h4" />
     <path d="m16.2 16.2 2.9 2.9" />
     <path d="M12 18v4" />
     <path d="m4.9 19.1 2.9-2.9" />
     <path d="M2 12h4" />
     <path d="m4.9 4.9 2.9 2.9" />
   </svg>`;

export const doneIcon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-circle-check-big preview-icon"
    >
      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
      <path d="m9 11 3 3L22 4" />
    </svg>
`;
