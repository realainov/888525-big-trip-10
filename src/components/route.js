import AbstractComponent from './abstract-component';
import {formatMarkupDate} from '../utils/common';

const calculateTotalPrice = (points) => {
  let totalPrice = 0;

  points.forEach((point) => {
    totalPrice += +point.price;

    point.offers.forEach((offer) => {
      totalPrice += +offer.price;
    });
  });

  return totalPrice;
};

const createRouteMarkup = (points) => {
  if (points.length !== 0) {
    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    const startDate = formatMarkupDate(startPoint.date.from);

    let endDate = formatMarkupDate(endPoint.date.to);

    endDate = endDate.substring(0, 3) === startDate.substring(0, 3) ? endDate.substring(4) : endDate;

    const startCity = startPoint.destination.name;
    const endCity = endPoint.destination.name;

    const route = `${startCity} &mdash; ${points.length === 3 ? `${points[1].destination.name}` : `...`} &mdash; ${endCity}`;

    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${startDate} &mdash; ${endDate}</p>
      </div>`
    );
  }

  return ``;
};

const createTemplate = (points) => {
  const totalPrice = calculateTotalPrice(points);

  return (
    `<section class="trip-main__trip-info  trip-info">
      ${createRouteMarkup(points)}
      <p class="trip-info__cost">
        Total: &euro; <span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
};

export default class RouteComponent extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return createTemplate(this._points);
  }
}
