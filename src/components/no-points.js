import {createElement} from "../utils";

const createTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoPoints {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(createTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
