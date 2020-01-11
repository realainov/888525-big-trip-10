import AbstractSmartComponent from './abstract-smart-component';

const calculateTotalPrice = (points) => {
  let totalPrice = 0;

  points.forEach((point) => {
    totalPrice += +point.price;

    point.options.forEach((option) => {
      totalPrice = option.isChecked ? totalPrice + +option.price : totalPrice;
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

export default class RouteCostComponent extends AbstractSmartComponent {
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
