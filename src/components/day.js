import {createElement, getMarkupDate} from "../utils";

const createTemplate = (date, indexDate) => {
  const dateTime = `${date[0].time.start.getFullYear()}-${date[0].time.start.getMonth()}-${date[0].time.start.getDate()}`;

  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${indexDate + 1}</span>
        <time class="day__date" datetime="${dateTime}">${getMarkupDate(date[0])}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day {
  constructor(date, indexDate) {
    this._element = null;
    this._date = date;
    this._indexDate = indexDate;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(createTemplate(this._date, this._indexDate));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
