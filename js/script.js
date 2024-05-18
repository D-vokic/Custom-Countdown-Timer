// DOM Elements
const countdownForm = document.getElementById('countdownForm');
const inputContainer = document.getElementById('input-container');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// Time constants
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// Variables
let countdownTitle = '';
let countdownDate = '';
let countdownValue;
let countdownActive;
let savedCountdown;

/**
 * Initialize the date input field with today's date.
 */
function initDateInput() {
  const today = new Date().toISOString().split('T')[0];
  dateEl.setAttribute('min', today);
}

/**
 * Calculate and format the remaining time.
 * @param {number} distance - The remaining time in milliseconds.
 * @returns {Object} An object containing the days, hours, minutes, and seconds.
 */
function calculateTime(distance) {
  const days = Math.floor(distance / DAY);
  const hours = Math.floor((distance % DAY) / HOUR);
  const minutes = Math.floor((distance % HOUR) / MINUTE);
  const seconds = Math.floor((distance % MINUTE) / SECOND);
  return { days, hours, minutes, seconds };
}

/**
 * Show the countdown UI with the calculated time.
 * @param {Object} time - An object containing the days, hours, minutes, and seconds.
 */
function showCountdown({ days, hours, minutes, seconds }) {
  countdownElTitle.textContent = countdownTitle;
  timeElements[0].textContent = `${days}`;
  timeElements[1].textContent = `${hours}`;
  timeElements[2].textContent = `${minutes}`;
  timeElements[3].textContent = `${seconds}`;

  inputContainer.hidden = true;
  countdownEl.hidden = false;
  completeEl.hidden = true;
}

/**
 * Show the complete UI when the countdown finishes.
 */
function showComplete() {
  completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
  countdownEl.hidden = true;
  completeEl.hidden = false;
}

/**
 * Update the countdown every second.
 */
function updateCountdownDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    if (distance < 0) {
      clearInterval(countdownActive);
      showComplete();
    } else {
      const time = calculateTime(distance);
      showCountdown(time);
    }
  }, SECOND);
}

/**
 * Handle form submission to start a new countdown.
 * @param {Event} e - The form submission event.
 */
function handleFormSubmit(e) {
  e.preventDefault();
  countdownTitle = e.target[0].value;
  countdownDate = e.target[1].value;

  if (!countdownDate) {
    alert('Please select a date for the countdown.');
    return;
  }

  countdownValue = new Date(countdownDate).getTime();
  savedCountdown = { title: countdownTitle, date: countdownDate };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  updateCountdownDOM();
}

/**
 * Reset the countdown and clear all related data.
 */
function resetCountdown() {
  clearInterval(countdownActive);

  countdownTitle = '';
  countdownDate = '';
  countdownValue = null;
  localStorage.removeItem('countdown');

  inputContainer.hidden = false;
  countdownEl.hidden = true;
  completeEl.hidden = true;
}

/**
 * Restore the previous countdown from localStorage if available.
 */
function restorePreviousCountdown() {
  const savedCountdownData = localStorage.getItem('countdown');
  if (savedCountdownData) {
    savedCountdown = JSON.parse(savedCountdownData);
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();

    updateCountdownDOM();
  }
}

/**
 * Initialize the application.
 */
function init() {
  initDateInput();
  restorePreviousCountdown();

  // Event Listeners
  countdownForm.addEventListener('submit', handleFormSubmit);
  countdownBtn.addEventListener('click', resetCountdown);
  completeBtn.addEventListener('click', resetCountdown);
}

// On Load
init();





