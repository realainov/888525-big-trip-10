import Days from './components/days';
import Day from './components/day';
import Point from './components/point';
import PointEdit from './components/point-edit';
import NoPoints from './components/no-points';
import Filter from './components/filter';
import RouteInfo from './components/route-info';
import SiteMenu from './components/site-menu';
import TripSort from './components/trip-sort';
import {filters} from './data/filter';
import {generateEvents} from './data/event';
import {render, getMarkupDate} from './utils';

const TASK_COUNT = 4;

const renderPoint = (point, container) => {
  const eventElement = new Point(point).getElement();
  const eventEditElement = new PointEdit(point).getElement();

  const openButtonElement = eventElement.querySelector(`.event__rollup-btn`);
  const closeButtonElement = eventEditElement.querySelector(`.event__rollup-btn`);

  const onEscapeKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      container.replaceChild(eventElement, eventEditElement);

      document.removeEventListener(`keydown`, onEscapeKeyDown);
    }
  };

  openButtonElement.addEventListener(`click`, () => {
    container.replaceChild(eventEditElement, eventElement);

    document.addEventListener(`keydown`, onEscapeKeyDown);
  });

  closeButtonElement.addEventListener(`click`, () => {
    container.replaceChild(eventElement, eventEditElement);

    document.removeEventListener(`keydown`, onEscapeKeyDown);
  });

  const editFormElement = eventEditElement.querySelector(`form`);

  editFormElement.addEventListener(`submit`, () => {
    container.replaceChild(eventElement, eventEditElement);

    document.removeEventListener(`keydown`, onEscapeKeyDown);
  });

  render(container, eventElement);
};

const points = generateEvents(TASK_COUNT);

points.sort((a, b) => {
  if (a.time.start > b.time.start) {
    return 1;
  }

  if (a.time.start < b.time.start) {
    return -1;
  }

  return 0;
});

const dates = new Set();

points.forEach((point) => {
  dates.add(getMarkupDate(point));
});

const dateEvents = {};

dates.forEach((date) => {
  dateEvents[date] = [];
});

points.forEach((point) => {
  dateEvents[getMarkupDate(point)].push(point);
});

const tripInfoElement = document.querySelector(`.trip-info`);
const routeInfoElement = new RouteInfo(dateEvents).getElement();

render(tripInfoElement, routeInfoElement, `afterbegin`);

const tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);
const siteMenuElement = new SiteMenu().getElement();
const filterElement = new Filter(filters).getElement();

render(tripControlsHeaderElements[0], siteMenuElement, `afterend`);
render(tripControlsHeaderElements[1], filterElement, `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);

if (Object.keys(dateEvents).length === 0) {
  const noPointsElement = new NoPoints().getElement();

  render(tripEventsElement, noPointsElement);
} else {
  const tripSortElement = new TripSort().getElement();
  const daysElement = new Days().getElement();

  render(tripEventsElement, tripSortElement);

  render(tripEventsElement, daysElement);

  const tripDaysElement = document.querySelector(`.trip-days`);

  Object.entries(dateEvents).forEach((event, indexEvent) => {
    const dateEvent = event[0];
    const events = event[1];

    const dayElement = new Day(dateEvents[dateEvent], indexEvent).getElement();
    const tripEventsListElement = dayElement.querySelector(`.trip-events__list`);

    render(tripDaysElement, dayElement);

    events.forEach((point) => {
      renderPoint(point, tripEventsListElement);
    });
  });
}
