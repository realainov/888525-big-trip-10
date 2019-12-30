import AbstractComponent from './abstract-component';

const createTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class DaysComponent extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
