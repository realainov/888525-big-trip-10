import AbstractComponent from './abstract-component';

const createTemplate = () => {
  return (
    `<li class="trip-events__item"></li>`
  );
};

export default class PointsComponent extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
