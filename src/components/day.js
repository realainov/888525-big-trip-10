import AbstractComponent from './abstract-component';
import {getMarkupDate} from "../utils/common";

const createTemplate = (date, index) => {
  if (date !== undefined && index !== undefined) {
    const dateTime = `${date[0].time.start.getFullYear()}-${date[0].time.start.getMonth()}-${date[0].time.start.getDate()}`;

    return (
      `<li class="trip-days__item day">
        <div class="day__info">
          <span class="day__counter">${index + 1}</span>
          <time class="day__date" datetime="${dateTime}">${getMarkupDate(date[0])}</time>
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
