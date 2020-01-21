import AbstractComponent from './abstract-component';

const createTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class AddButtonComponent extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  setDisabled(isDisabled) {
    this.getElement().disabled = isDisabled;
  }
}
