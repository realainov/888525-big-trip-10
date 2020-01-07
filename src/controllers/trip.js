import TripSortComponent from '../components/trip-sort';
import DaysComponent from '../components/days';
import NoPointsComponent from '../components/no-points';
import DayComponent from '../components/day';
import PointController from '../controllers/point';
import {SortType} from '../components/trip-sort';
import {render} from '../utils/render';
import {formatMarkupDate} from '../utils/common';

const renderPoint = (container, point, onDataChange, onViewChange) => {
  const pointController = new PointController(container, onDataChange, onViewChange);

  pointController.render(point);

  return pointController;
};

const renderPoints = (container, points, onDataChange, onViewChange, isWithDates = true) => {
  const pointControllers = [];

  if (isWithDates) {
    const dates = new Set();

    points.forEach((point) => {
      dates.add(formatMarkupDate(point.time.start));
    });

    const events = {};

    dates.forEach((date) => {
      events[date] = [];
    });

    points.forEach((point) => {
      events[formatMarkupDate(point.time.start)].push(point);
    });

    Object.entries(events).forEach((event, index) => {
      const [eventDate, eventPoints] = event;

      const dayComponent = new DayComponent(events[eventDate], index);

      render(container, dayComponent);

      eventPoints.forEach((point) => {
        pointControllers.push(renderPoint(dayComponent.eventsListElement, point, onDataChange, onViewChange));
      });
    });
  } else {
    const dayComponent = new DayComponent();

    render(container, dayComponent);

    points.forEach((point) => {
      pointControllers.push(renderPoint(dayComponent.eventsListElement, point, onDataChange, onViewChange));
    });
  }

  return pointControllers;
};

export default class TripController {
  constructor(containerElement) {
    this._containerElement = containerElement;

    this._noPoitsComponent = new NoPointsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._daysComponent = new DaysComponent();

    this._points = [];
    this._showedPointControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(points) {
    this._points = points;

    if (this._points.length === 0) {
      render(this._containerElement, this._noPoitsComponent);
    } else {
      render(this._containerElement, this._tripSortComponent);
      render(this._containerElement, this._daysComponent);

      this._showedPointControllers = renderPoints(this._daysComponent.getElement(), this._points, this._onDataChange, this._onViewChange);
    }
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._points.findIndex((item) => item === oldData);

    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));

    pointController.render(this._points[index]);
  }

  _onViewChange() {
    this._showedPointControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._daysComponent.getElement().innerHTML = ``;

    switch (sortType) {
      case SortType.EVENT:
        this._points.sort((a, b) => a.time.start - b.time.start);

        this._showedPointControllers = renderPoints(this._daysComponent.getElement(), this._points, this._onDataChange, this._onViewChange);
        break;
      case SortType.TIME:
        this._points.sort((a, b) => (b.time.end - b.time.start) - (a.time.end - a.time.start));

        this._showedPointControllers = renderPoints(this._daysComponent.getElement(), this._points, this._onDataChange, this._onViewChange, false);
        break;
      case SortType.PRICE:
        this._points.sort((a, b) => b.price - a.price);

        this._showedPointControllers = renderPoints(this._daysComponent.getElement(), this._points, this._onDataChange, this._onViewChange, false);
        break;
    }
  }
}
