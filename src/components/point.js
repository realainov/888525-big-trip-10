import {createElement, castTimeFormat, calculateDuration} from "../utils";

const createOptionsMarkup = (options) => {
  return options
    .map((item) => {
      return (
        `<li class="event__offer">
            <span class="event__offer-title">${item.name}</span>
            +
            &euro; <span class="event__offer-price">${item.price}</span>
           </li>`
      );
    })
    .join(`\n`);
};

const createTemplate = (point) => {
  const {type, city, price, options, time} = point;

  const startTime = `${castTimeFormat(time.start.getHours())}:${castTimeFormat(time.start.getMinutes())}`;
  const endTime = `${castTimeFormat(time.end.getHours())}:${castTimeFormat(time.end.getMinutes())}`;

  const startDateTime = `${time.start.getFullYear()}-${time.start.getMonth()}-${time.start.getDay()}T${startTime}`;
  const endDateTime = `${time.end.getFullYear()}-${time.end.getMonth()}-${time.end.getDay()}T${endTime}`;

  const duration = calculateDuration(time.end - time.start);

  const optionsMarkup = createOptionsMarkup(options);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.name}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type.title} ${city}</h3>

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
      </div>
    </li>`
  );
};

export default class Point {
  constructor(point) {
    this._element = null;
    this._point = point;
  }

  getTemplate() {
    return createTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(createTemplate(this._point));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}