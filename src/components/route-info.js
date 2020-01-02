import AbstractComponent from './abstract-component';
import {getMarkupDate} from '../utils/common';

const createTemplate = (points) => {
  if (points.length !== 0) {
    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    let startDate = getMarkupDate(startPoint);
    let endDate = getMarkupDate(endPoint);

    endDate = endDate.substring(0, 3) === startDate.substring(0, 3) ? endDate.substring(4) : endDate;

    const startCity = startPoint.city;
    const endCity = endPoint.city;

    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${startCity} &mdash; ... &mdash; ${endCity}</h1>
  
        <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp${endDate}</p>
      </div>`
    );
  }

  return ``;
};

export default class RouteInfoComponent extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return createTemplate(this._points);
  }
}
