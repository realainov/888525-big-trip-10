import AbstractComponent from './abstract-component';

const calculateTotalPrice = (points) => {
  let totalPrice = 0;

  points.forEach((point) => {
    totalPrice += point.price;

    point.options.forEach((option) => {
      totalPrice += option.price;
    });
  });

  return totalPrice;
};

const createTemplate = (points) => {
  if (points.length === 0) {
    return (
      `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
      </p>`
    );
  } else {
    const totalPrice = calculateTotalPrice(points);

    return (
      `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>`
    );
  }
};

export default class RouteCostComponent extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return createTemplate(this._points);
  }
}
