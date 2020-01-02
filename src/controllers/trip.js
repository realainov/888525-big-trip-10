import PointEditComponent from '../components/point-edit';
import PointComponent from '../components/point';
import TripSortComponent from '../components/trip-sort';
import DaysComponent from '../components/days';
import NoPointsComponent from '../components/no-points';
import DayComponent from '../components/day';
import {SortType} from '../components/trip-sort';
import {render, replace} from '../utils/render';
import {getMarkupDate} from '../utils/common';

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

  pointComponent.setRollupButtonClickHandler(() => {
    replace(pointEditComponent, pointComponent);

    document.addEventListener(`keydown`, onEscapeKeyDown);
  });

  pointEditComponent.setRollupButtonClickHandler(() => {
    replace(pointComponent, pointEditComponent);

    document.removeEventListener(`keydown`, onEscapeKeyDown);
  });

  pointEditComponent.setEditFormSubmitHandler(() => {
    replace(pointComponent, pointEditComponent);

    document.removeEventListener(`keydown`, onEscapeKeyDown);
  });

  render(container, pointComponent);
};

const renderPoints = (container, points, isWithDates = true) => {
  if (isWithDates) {
    const dates = new Set();

    points.forEach((point) => {
      dates.add(getMarkupDate(point));
    });

    const events = {};

    dates.forEach((date) => {
      events[date] = [];
    });

    points.forEach((point) => {
      events[getMarkupDate(point)].push(point);
    });

    Object.entries(events).forEach((event, index) => {
      const [eventDate, eventPoints] = event;

      const dayComponent = new DayComponent(events[eventDate], index);

      render(container, dayComponent);

      eventPoints.forEach((point) => {
        renderPoint(dayComponent.eventsListElement, point);
      });
    });
  } else {
    const dayComponent = new DayComponent();

    render(container, dayComponent);

    points.forEach((point) => {
      renderPoint(dayComponent.eventsListElement, point);
    });
  }
};

export default class TripController {
  constructor(containerElement) {
    this._containerElement = containerElement;

    this._noPoitsComponent = new NoPointsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._daysComponent = new DaysComponent();
  }

  render(points) {
    if (points.length === 0) {
      render(this._containerElement, this._noPoitsComponent);
    } else {
      render(this._containerElement, this._tripSortComponent);
      render(this._containerElement, this._daysComponent);

      renderPoints(this._daysComponent.getElement(), points);
    }

    this._tripSortComponent.setSortTypeChangeHandler((sortType) => {
      this._daysComponent.getElement().innerHTML = ``;

      switch (sortType) {
        case SortType.EVENT:
          points.sort((a, b) => a.time.start - b.time.start);

          renderPoints(this._daysComponent.getElement(), points);
          break;
        case SortType.TIME:
          points.sort((a, b) => (b.time.end - b.time.start) - (a.time.end - a.time.start));

          renderPoints(this._daysComponent.getElement(), points, false);
          break;
        case SortType.PRICE:
          points.sort((a, b) => b.price - a.price);

          renderPoints(this._daysComponent.getElement(), points, false);
          break;
      }
    });
  }
}
