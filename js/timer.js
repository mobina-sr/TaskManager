import {
  timerDisplay,
  startTimerBtn,
  resetTimerBtn,
  reportBtn,
  reportModal,
  closeReportModalBtn,
  dailyReportList,
  weeklyTotalTime,
} from "./elements.js";
// --------------------------------------------------
// STATE
const STORAGE_KEY = "timer";
const DAILY_STORAGE_KEY = "dailyFocus";

let dailyFocus = {};

let accumulatedMs = 0;
let startedAt = null;
let tickInterval = null;

// --------------------------------------------------
// STORAGE

const saveTimer = function () {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ accumulatedMs, startedAt }),
  );
};

const saveDailyFocus = function () {
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(dailyFocus));
};

const loadDailyFocus = function () {
  try {
    const saved = JSON.parse(localStorage.getItem(DAILY_STORAGE_KEY));

    if (saved && typeof saved === "object") {
      dailyFocus = saved;
    }
  } catch {
    dailyFocus = {};
  }
};

const recordDailyFocus = function (startTime, endTime) {
  let currentTime = startTime;

  while (currentTime < endTime) {
    const date = new Date(currentTime);
    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const nextDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
    ).getTime();

    const segmentEnd = Math.min(endTime, nextDay);
    const duration = segmentEnd - currentTime;

    dailyFocus[dateKey] = (dailyFocus[dateKey] || 0) + duration;

    currentTime = segmentEnd;
  }

  saveDailyFocus();
};

const formatTime = function (milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const showWeeklyReport = function () {
  dailyReportList.innerHTML = "";

  let weeklyTotal = 0;

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const dailyTime = dailyFocus[dateKey] || 0;

    weeklyTotal += dailyTime;

    const listItem = document.createElement("li");

    listItem.innerHTML = `
      <span>${date.toLocaleDateString()}</span>
      <span>${formatTime(dailyTime)}</span>
    `;

    dailyReportList.append(listItem);
  }

  weeklyTotalTime.textContent = formatTime(weeklyTotal);
};

const loadTimer = function () {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;

    if (Number.isFinite(saved.accumulatedMs))
      accumulatedMs = saved.accumulatedMs;
    if (Number.isFinite(saved.startedAt)) startedAt = saved.startedAt;
  } catch {}
};

// --------------------------------------------------
// ELAPSED TIME

const getElapsedMs = function () {
  if (!startedAt) return accumulatedMs;

  return accumulatedMs + Math.max(0, Date.now() - startedAt);
};

// --------------------------------------------------
// DISPLAY

const pad = (number) => String(number).padStart(2, "0"); // 00:00:00

const displayTimer = function () {
  const totalSeconds = Math.floor(getElapsedMs() / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const updateStartButton = function () {
  if (startedAt) {
    // Pause
    startTimerBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <rect x="14" y="3" width="5" height="18" rx="1"/>
        <rect x="5" y="3" width="5" height="18" rx="1"/>
      </svg>
    `;
    startTimerBtn.setAttribute("aria-label", "Pause");
  } else if (getElapsedMs() > 0) {
    // Resume
    startTimerBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a10 10 0 0 1 7.38 16.75"/>
        <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"/>
        <path d="M2.5 8.875a10 10 0 0 0-.5 3"/>
        <path d="M2.83 16a10 10 0 0 0 2.43 3.4"/>
        <path d="M4.636 5.235a10 10 0 0 1 .891-.857"/>
        <path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/>
      </svg>
    `;
    startTimerBtn.setAttribute("aria-label", "Resume");
  } else {
    // Start
    startTimerBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
      </svg>
    `;
    startTimerBtn.setAttribute("aria-label", "Start");
  }
};

// --------------------------------------------------
// ACTIONS

const startTicking = function () {
  tickInterval = setInterval(displayTimer, 250);
};

const stopTicking = function () {
  clearInterval(tickInterval);
  tickInterval = null;
};

const startTimer = function () {
  if (startedAt) return;

  startedAt = Date.now();
  startTicking();

  saveTimer();
  updateStartButton();
};

const pauseTimer = function () {
  if (!startedAt) return;

  const endTime = Date.now();

  accumulatedMs = getElapsedMs();

  recordDailyFocus(startedAt, endTime);

  startedAt = null;
  stopTicking();

  saveTimer();
  displayTimer();
  updateStartButton();
};

const toggleTimer = function () {
  if (startedAt) {
    pauseTimer();
  } else {
    startTimer();
  }
};

const resetTimer = function () {
  if (!confirm("Reset the timer?")) return;

  accumulatedMs = 0;
  startedAt = null;
  stopTicking();

  saveTimer();
  displayTimer();
  updateStartButton();
};

// --------------------------------------------------
// INITIALIZE TIMER

export const initTimer = function () {
  if (!timerDisplay || !startTimerBtn || !resetTimerBtn) {
    console.error("Timer elements not found!");
    return;
  }

  loadTimer();
  loadDailyFocus();

  if (startedAt) pauseTimer();

  displayTimer();
  updateStartButton();

  startTimerBtn.addEventListener("click", toggleTimer);
  resetTimerBtn.addEventListener("click", resetTimer);

  reportBtn.addEventListener("click", () => {
    showWeeklyReport();
    reportModal.classList.add("show");
  });

  closeReportModalBtn.addEventListener("click", () => {
    reportModal.classList.remove("show");
  });

  document.addEventListener("visibilitychange", displayTimer);
};
