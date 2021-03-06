import AbstractComponent from './abstract-component';

const createTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoPointsComponent extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
