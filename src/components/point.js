import AbstractComponent from './abstract-component';
import {calculateDuration, formatTime, formatDateTime} from '../utils/common';
import {typeMap} from '../const';

const MAX_OFFERS_COUNT = 3;

const createOffersMarkup = (offers) => {
  return offers
    .slice(0, MAX_OFFERS_COUNT)
    .map((offer) => {
      return (
        `<li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            +
            &euro; <span class="event__offer-price">${offer.price}</span>
           </li>`
      );
    })
    .join(`\n`);
};

const createTemplate = (point) => {
  const {type, destination, price, offers, date} = point;

  const startTime = formatTime(date.from);
  const endTime = formatTime(date.to);

  const startDateTime = formatDateTime(date.from);
  const endDateTime = formatDateTime(date.to);

  const duration = calculateDuration(date.to - date.from);

  const offersMarkup = createOffersMarkup(offers);

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${typeMap[type]} ${destination.name}</h3>

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
        ${offersMarkup}
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
