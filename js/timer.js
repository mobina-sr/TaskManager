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
    startTimerBtn.textContent = "Pause";
  } else if (getElapsedMs() > 0) {
    startTimerBtn.textContent = "Resume";
  } else {
    startTimerBtn.textContent = "Start";
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
