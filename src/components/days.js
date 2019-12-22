import {createElement} from "../utils";

const createTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class Days {
  constructor() {
    this._element = null;
  }

  createElement() {
    if (!this._element) {
      this._element = createElement(createTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
