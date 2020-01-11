import AbstractSmartComponent from './abstract-smart-component';
import {formatMarkupDate, formatMarkupFullDate} from '../utils/common';

const createTemplate = (points) => {
  if (points.length !== 0) {
    const sortedPoints = points.slice().sort((a, b) => a.time.start - b.time.start);

    const startPoint = sortedPoints[0];
    const endPoint = sortedPoints[sortedPoints.length - 1];

    const isEqualYear = startPoint.time.start.getFullYear() === endPoint.time.start.getFullYear();

    let startDate = isEqualYear ? formatMarkupDate(startPoint.time.start) : formatMarkupFullDate(startPoint.time.start);
    let endDate = isEqualYear ? formatMarkupDate(endPoint.time.start) : formatMarkupFullDate(endPoint.time.start);

    if (isEqualYear) {
      endDate = endDate.substring(0, 3) === startDate.substring(0, 3) ? endDate.substring(4) : endDate;
    }

    const startCity = startPoint.city;
    const endCity = endPoint.city;

    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${startCity} &mdash; ${sortedPoints.length === 3 ? `${sortedPoints[1].city}` : `...`} &mdash; ${endCity}</h1>

        <p class="trip-info__dates">${startDate}&nbsp;&mdash; ${endDate}</p>
      </div>`
    );
  }

  return ``;
};

export default class RouteInfoComponent extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;

    this._onDataChange = this._onDataChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  getTemplate() {
    return createTemplate(this._pointsModel.getPoints());
  }

  recoveryEventListeners() {

  }

  _onDataChange() {
    this.rerender();
  }
}
