import { START_BTN_MARKUP, PAUSE_BTN_MARKUP, RESET_BTN_MARKUP } from './CustomTimer.constants.mjs';

class CustomTimer extends HTMLElement {
  constructor() {
    super();

    this._secondsAttrValue = parseInt(this.getAttribute('seconds'));
    this._toTimeAttrValue = this.getAttribute('to-time');

    this._isStarted = false;
    this._timeInSeconds = null;
    this._endTime = null;
    this._timerInterval = null;

    this._startBtn = null;
    this._pauseBtn = null;
    this._resetBtn = null;
    this._timerDisplay = null;

    this._startTimerEvent = new CustomEvent('starttimer', { composed: true });
    this._pauseTimerEvent = new CustomEvent('pausetimer', { composed: true });
    this._resetTimerEvent = new CustomEvent('resettimer', { composed: true });
    this._endTimerEvent = new CustomEvent('endtimer', { composed: true });

    this.addEventListener('starttimer', this.startTimer);
    this.addEventListener('pausetimer', this.pauseTimer);
    this.addEventListener('resettimer', this.resetTimer);
    this.addEventListener('endtimer', this.endTimer);
  }

  static get observedAttributes() {
    return ['to-time', 'seconds',];
  }

  attributeChangedCallback() {
    this.pauseTimer();

    this._secondsAttrValue = parseInt(this.getAttribute('seconds'));
    this._toTimeAttrValue = this.getAttribute('to-time');

    this._checkAttribute();
    this.resetTimer();
  }

  connectedCallback() {
    this._initShadowDOM();
    this._addSlots();
    this._addControlButtons();
    this._checkAttribute();
    this._updateTimerDisplay();
  }

  disconnectedCallback() {
    this.pauseTimer();
  }

  startTimer() {
    if (!this._isStarted) {
      this._isStarted = true;
      this._timerInterval = setInterval(() => {
        if (this._timeInSeconds <= 0) {
          this.pauseTimer();
          this.dispatchEvent(this._endTimerEvent);
        } else {
          this._timeInSeconds--;
          this._updateTimerDisplay();
        }
      }, 1000);
    }
  }

  pauseTimer() {
    if (this._isStarted) {
      this._isStarted = false;
      clearInterval(this._timerInterval);
    }
  }

  resetTimer() {
    this.pauseTimer();
    this._checkAttribute();
    this._updateTimerDisplay();
  }

  endTimer() {
    clearInterval(this._timerInterval);
    this._isStarted = false;
  }

  _checkAttribute() {
    if (this._secondsAttrValue) {
      this._timeInSeconds = this._secondsAttrValue;
    }

    if (this._toTimeAttrValue) {
      this._timeInSeconds = this._toSeconds(this._toTimeAttrValue);
    }
  }

  _updateTimerDisplay() {
    const hours = Math.floor(this._timeInSeconds / 3600);
    const minutes = Math.floor((this._timeInSeconds % 3600) / 60);
    const seconds = this._timeInSeconds % 60;

    let displayText = '';

    if (hours > 0) {
      displayText += `${String(hours).padStart(2, '0')}:`;
    }

    displayText += `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    this._timerDisplay.textContent = displayText;
  }

  _initShadowDOM() {
    this._shadow = this.attachShadow({ mode: 'closed' });
    this._shadow.innerHTML = `
    <style>
      .timer__display {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22.5rem;
        height: 22.5rem;
        border-radius: 50%;
        background-color: var(--base-weak);
        box-shadow: var(--default-shadow);
        margin: 2.5rem 0 1.75rem 0;
        grid-area: timer;

        font-weight: 700;
        font-size: 3.2rem;
      }
    </style>
    <div class="timer__display"></div>`;
    this._timerDisplay = this._shadow.querySelector('.timer__display');
  }

  _addSlots() {
    const startBtnSlot = document.createElement('slot');
    const pauseBtnSlot = document.createElement('slot');
    const resetBtnSlot = document.createElement('slot');

    startBtnSlot.setAttribute('name', 'start-btn');
    pauseBtnSlot.setAttribute('name', 'pause-btn');
    resetBtnSlot.setAttribute('name', 'reset-btn');

    this._shadow.append(startBtnSlot, pauseBtnSlot, resetBtnSlot);
  }

  _addControlButtons() {
    this._addMarkup();

    this._startBtn = this.querySelector('.timer__start-btn');
    this._pauseBtn = this.querySelector('.timer__pause-btn');
    this._resetBtn = this.querySelector('.timer__reset-btn');

    this._startBtn.addEventListener('click', () => {
      this.dispatchEvent(this._startTimerEvent);
    });

    this._pauseBtn.addEventListener('click', () => {
      this.dispatchEvent(this._pauseTimerEvent);
    });

    this._resetBtn.addEventListener('click', () => {
      this.dispatchEvent(this._resetTimerEvent);
    });
  }

  _addMarkup() {
    this.innerHTML = PAUSE_BTN_MARKUP;
    this.insertAdjacentHTML('beforeend', START_BTN_MARKUP);
    this.insertAdjacentHTML('beforeend', RESET_BTN_MARKUP);
  }

  _toSeconds(targetTimeStr) {
    const currentTime = new Date();

    const targetTimeParts = targetTimeStr.split(':');
    const targetHour = parseInt(targetTimeParts[0], 10);
    const targetMinute = parseInt(targetTimeParts[1], 10);
    const targetSecond = parseInt(targetTimeParts[2], 10);

    const targetTime = new Date(currentTime);
    targetTime.setHours(targetHour);
    targetTime.setMinutes(targetMinute);
    targetTime.setSeconds(targetSecond);

    const timeDifferenceMillis = targetTime - currentTime;
    const secondsDifference = timeDifferenceMillis / 1000;

    return secondsDifference;
  }
}

export default CustomTimer;
