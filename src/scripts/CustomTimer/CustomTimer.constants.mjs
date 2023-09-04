export const START_BTN_MARKUP = `<button type="button" slot="start-btn" class="timer__btn timer__start-btn">Start</button>;`;

export const PAUSE_BTN_MARKUP = `<button type="button" slot="pause-btn" class="timer__btn timer__pause-btn">Pause</button>;`;

export const RESET_BTN_MARKUP = `<button type="button" slot="reset-btn" class="timer__btn timer__reset-btn">Reset</button>;`;

export const TIMER_MARKUP = ` <div class="timer__display"></div>`;

export const TIMER_STYLES = `
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
`;
