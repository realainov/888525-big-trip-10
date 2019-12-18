const calculateTotalPrice = (dateEvents) => {
  let totalPrice = 0;

  Object.values(dateEvents).forEach((event) => {
    event.forEach((point) => {
      totalPrice += point.price;
    });
  });

  return totalPrice;
};

const createTemplate = (dateEvents) => {
  const dates = Object.keys(dateEvents);
  const events = Object.values(dateEvents);

  let startDate = dates[0];
  let endDate = dates[dates.length - 1];

  const startCity = events[0][0].city;
  const endCity = events[events.length - 1][events[events.length - 1].length - 1].city;

  endDate = endDate.substring(0, 3) === startDate.substring(0, 3) ? endDate.substring(3) : endDate;

  const totalPrice = calculateTotalPrice(dateEvents);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${startCity} &mdash; ... &mdash; ${endCity}</h1>

      <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp${endDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`
  );
};

export const routeInfo = {
  createTemplate
};
