import AbstractComponent from './abstract-component';
import {formatMarkupDate, formatDateTime} from "../utils/common";
import {remove} from '../utils/render';

const createTemplate = (points, index) => {
  if (points !== undefined && index !== undefined) {
    const dateTime = formatDateTime(points[0].time.start);
    const date = formatMarkupDate(points[0].time.start);

    return (
      `<li class="trip-days__item day">
        <div class="day__info">
          <span class="day__counter">${index + 1}</span>
          <time class="day__date" datetime="${dateTime}">${date}</time>
        </div>
  
        <ul class="trip-events__list"></ul>
      </li>`
    );
  } else {
    return (
      `<li class="trip-days__item day">
        <div class="day__info"></div>
  
        <ul class="trip-events__list"></ul>
      </li>`
    );
  }
};

export default class DayComponent extends AbstractComponent {
  constructor(date, index) {
    super();

    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createTemplate(this._date, this._index);
  }

  get eventsListElement() {
    return this.findElement(`.trip-events__list`);
  }
}
