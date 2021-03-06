import {getPointsByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Points {
  constructor(points) {
    this._points = [];

    this._currentFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];

    this.setPoints(points);
  }

  getPoints() {
    return getPointsByFilter(this._points, this._currentFilterType);
  }

  getAllPoints() {
    return this._points.slice().sort((a, b) => a.date.from - b.date.from);
  }

  getFilterPoints(filterType) {
    return getPointsByFilter(this._points, filterType);
  }

  setPoints(points) {
    this._points = Array.from(points);

    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._currentFilterType = filterType;

    this._callHandlers(this._filterChangeHandlers);
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);

    this._points.sort((a, b) => a.date.from - b.date.from);

    this._callHandlers(this._dataChangeHandlers);
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removePoint(id) {
    const index = this._points.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
