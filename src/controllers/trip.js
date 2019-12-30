import PointEditComponent from '../components/point-edit';
import PointComponent from '../components/point';
import TripSortComponent from '../components/trip-sort';
import DaysComponent from '../components/days';
import NoPointsComponent from '../components/no-points';
import DayComponent from '../components/day';
import {render, replace} from '../utils/render';

const renderPoint = (container, point) => {
  const pointComponent = new PointComponent(point);
  const pointEditComponent = new PointEditComponent(point);

  const onEscapeKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replace(pointComponent, pointEditComponent);

      document.removeEventListener(`keydown`, onEscapeKeyDown);
    }
  };

  pointComponent.rollupButton.addEventListener(`click`, () => {
    replace(pointEditComponent, pointComponent);

    document.addEventListener(`keydown`, onEscapeKeyDown);
  });

  pointEditComponent.rollupButton.addEventListener(`click`, () => {
    replace(pointComponent, pointEditComponent);

    document.removeEventListener(`keydown`, onEscapeKeyDown);
  });

  pointEditComponent.editForm.addEventListener(`submit`, () => {
    replace(pointComponent, pointEditComponent);

    document.removeEventListener(`keydown`, onEscapeKeyDown);
  });

  render(container, pointComponent);
};

export default class TripController {
  constructor(containerElement) {
    this._containerElement = containerElement;

    this._noPoitsComponent = new NoPointsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._daysComponent = new DaysComponent();
  }

  render(dateEvents) {
    if (Object.keys(dateEvents).length === 0) {
      render(this._containerElement, this._noPoitsComponent);
    } else {
      render(this._containerElement, this._tripSortComponent);

      render(this._containerElement, this._daysComponent);

      Object.entries(dateEvents).forEach((event, indexEvent) => {
        const [dateEvent, datePoints] = event;

        const dayComponent = new DayComponent(dateEvents[dateEvent], indexEvent);

        render(this._containerElement, dayComponent);

        datePoints.forEach((point) => {
          renderPoint(dayComponent.eventsList, point);
        });
      });
    }
  }
}
