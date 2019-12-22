import Days from './components/days';
import Day from './components/day';
import Event from './components/event';
import EventEdit from './components/event-edit';
import Filter from './components/filter';
import RouteInfo from './components/route-info';
import SiteMenu from './components/site-menu';
import TripSort from './components/trip-sort';
import {filters} from './data/filter';
import {generateEvents} from './data/event';
import {render, getMarkupDate} from './utils';

const TASK_COUNT = 4;

const renderPoint = (point, container) => {
  const eventElement = new Event(point).createElement();
  const eventEditElement = new EventEdit(point).createElement();

  const openButtonElement = eventElement.querySelector(`.event__rollup-btn`);
  const closeButtonElement = eventEditElement.querySelector(`.event__rollup-btn`);

  openButtonElement.addEventListener(`click`, () => {
    container.replaceChild(eventEditElement, eventElement);
  });

  closeButtonElement.addEventListener(`click`, () => {
    container.replaceChild(eventElement, eventEditElement);
  });

  const editFormElement = eventEditElement.querySelector(`form`);

  editFormElement.addEventListener(`submit`, () => {
    container.replaceChild(eventElement, eventEditElement);
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
const routeInfoElement = new RouteInfo(dateEvents).createElement();

render(tripInfoElement, routeInfoElement, `afterbegin`);

const tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);
const siteMenuElement = new SiteMenu().createElement();
const filterElement = new Filter(filters).createElement();

render(tripControlsHeaderElements[0], siteMenuElement, `afterend`);
render(tripControlsHeaderElements[1], filterElement, `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripSortElement = new TripSort().createElement();
const daysElement = new Days().createElement();

render(tripEventsElement, tripSortElement);
render(tripEventsElement, daysElement);

const tripDaysElement = document.querySelector(`.trip-days`);

Object.entries(dateEvents).forEach((event, indexEvent) => {
  const dateEvent = event[0];
  const events = event[1];

  const dayElement = new Day(dateEvents[dateEvent], indexEvent).createElement();
  const tripEventsListElement = dayElement.querySelector(`.trip-events__list`);

  render(tripDaysElement, dayElement);

  events.forEach((point) => {
    renderPoint(point, tripEventsListElement);
  });
});
