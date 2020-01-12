import AbstractComponent from './abstract-component';

const createTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>`
  );
};

export default class EventsComponent extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
