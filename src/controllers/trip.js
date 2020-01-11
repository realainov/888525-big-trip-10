import TripSortComponent from '../components/trip-sort';
import DaysComponent from '../components/days';
import NoPointsComponent from '../components/no-points';
import DayComponent from '../components/day';
import PointController from '../controllers/point';
import {SortType, Mode} from '../const';
import {render} from '../utils/render';
import {formatDate} from '../utils/common';
import {emptyPoint} from './point';

const renderPoint = (container, point, onDataChange, onViewChange) => {

  const pointController = new PointController(container, onDataChange, onViewChange);

  pointController.render(point);

  return pointController;
};

const renderPoints = (containerElement, points, onDataChange, onViewChange, isWithDates = true) => {
  containerElement.innerHTML = ``;

  const dayComponents = [];
  const pointControllers = [];

  if (isWithDates) {
    const dates = new Set();

    points.forEach((point) => {
      dates.add(formatDate(point.time.start));
    });

    const events = {};

    dates.forEach((date) => {
      events[date] = [];
    });

    points.forEach((point) => {
      events[formatDate(point.time.start)].push(point);
    });

    Object.entries(events).forEach((event, index) => {
      const [eventDate, eventPoints] = event;

      const dayComponent = new DayComponent(events[eventDate], index);

      dayComponents.push(dayComponent);

      render(containerElement, dayComponent);

      eventPoints.forEach((point) => {
        pointControllers.push(renderPoint(dayComponent.eventsListElement, point, onDataChange, onViewChange));
      });
    });
  } else {
    const dayComponent = new DayComponent();

    dayComponents.push(dayComponent);

    render(containerElement, dayComponent);

    points.forEach((point) => {
      pointControllers.push(renderPoint(dayComponent.eventsListElement, point, onDataChange, onViewChange));
    });
  }

  return {
    dayComponents,
    pointControllers
  };
};

export default class TripController {
  constructor(containerElement, pointsModel) {
    this._containerElement = containerElement;
    this._pointsModel = pointsModel;

    this._noPoitsComponent = new NoPointsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._daysComponent = new DaysComponent();

    this._dayComponents = [];
    this._pointControllers = [];

    this._creatingPoint = null;

    this._sortType = SortType.EVENT;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      render(this._containerElement, this._noPoitsComponent);
    } else {
      render(this._containerElement, this._tripSortComponent);
      render(this._containerElement, this._daysComponent);

      this._onSortTypeChange(this._sortType);
    }
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._onViewChange();

    this._creatingPoint = new PointController(this._tripSortComponent.getElement(), this._onDataChange, this._onViewChange);

    this._creatingPoint.render(emptyPoint, Mode.ADDING);
  }

  _removePoints() {
    this._dayComponents.forEach((dayComponent) => dayComponent.removeElement());
    this._dayComponents = [];

    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
  }

  _updatePoints() {
    const isWithDates = this._sortType === SortType.EVENT;

    console.log(this._pointsModel.getPoints());

    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints(), isWithDates);
  }

  _renderPoints(points, isWithDates) {
    const {dayComponents, pointControllers} = renderPoints(this._daysComponent.getElement(), points, this._onDataChange, this._onViewChange, isWithDates);

    this._dayComponents = dayComponents;
    this._pointControllers = pointControllers;
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === emptyPoint) {
      this._creatingPoint = null;

      if (newData === null) {
        pointController.destroy();

        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newData);

        pointController.destroy();

        this._updatePoints();
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);

      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(newData, oldData.id);

      if (isSuccess) {
        pointController.render(newData);
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;

    const points = this._pointsModel.getPoints();

    let sortedPoints = [];

    switch (sortType) {
      case SortType.EVENT:
        sortedPoints = points.slice().sort((a, b) => a.time.start - b.time.start);

        this._removePoints();
        this._renderPoints(sortedPoints);

        break;
      case SortType.TIME:
        sortedPoints = points.slice().sort((a, b) => (b.time.end - b.time.start) - (a.time.end - a.time.start));

        this._removePoints();
        this._renderPoints(sortedPoints, false);

        break;
      case SortType.PRICE:
        sortedPoints = points.slice().sort((a, b) => b.price - a.price);

        this._removePoints();
        this._renderPoints(sortedPoints, false);

        break;
    }
  }

  _onFilterChange() {
    this._updatePoints();
    this._onSortTypeChange(this._sortType);
  }
}
