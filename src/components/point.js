import AbstractComponent from './abstract-component';
import {calculateDuration, formatTime, formatDateTime} from '../utils/common';
import {typeMap} from '../const';

const createOptionsMarkup = (options) => {
  return options
    .filter((option) => option.isChecked)
    .slice(0, 3)
    .map((option) => {
      return (
        `<li class="event__offer">
            <span class="event__offer-title">${option.name}</span>
            +
            &euro; <span class="event__offer-price">${option.price}</span>
           </li>`
      );
    })
    .join(`\n`);
};

const createTemplate = (point) => {
  const {type, city, price, options, time} = point;

  const startTime = formatTime(time.start);
  const endTime = formatTime(time.end);

  const startDateTime = formatDateTime(time.start);
  const endDateTime = formatDateTime(time.end);

  const duration = calculateDuration(time.end - time.start);

  const optionsMarkup = createOptionsMarkup(options);

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${typeMap[type]} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDateTime}">${endTime}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${optionsMarkup}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class PointComponent extends AbstractComponent {
  constructor(point) {
    super();

    this._point = point;
  }

  getTemplate() {
    return createTemplate(this._point);
  }

  setRollupButtonClickHandler(handler) {
    this.findElement(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
