import {days} from "./components/days";
import {day} from './components/day';
import {filter} from './components/filter';
import {filters} from "./data/filter";
import {routeInfo} from './components/route-info';
import {siteMenu} from './components/site-menu';
import {tripSort} from './components/trip-sort';
import {generateEvents} from "./data/event";
import {getMarkupDate} from "./utils";

const TASK_COUNT = 4;

let points = generateEvents(TASK_COUNT);

points.sort((a, b) => {
  if (a.time.start > b.time.start) {
    return 1;
  }

  if (a.time.start < b.time.start) {
    return -1;
  }

  return 0;
});

let dates = new Set();

points.forEach((point) => {
  dates.add(getMarkupDate(point));
});

let dateEvents = {};

dates.forEach((date) => {
  dateEvents[date] = [];
});

points.forEach((point) => {
  dateEvents[getMarkupDate(point)].push(point);
});

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfoElement = document.querySelector(`.trip-info`);

render(tripInfoElement, routeInfo.createTemplate(dateEvents), `afterbegin`);

const tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);

render(tripControlsHeaderElements[0], siteMenu.createTemplate(), `afterend`);
render(tripControlsHeaderElements[1], filter.createTemplate(filters), `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, tripSort.createTemplate());
render(tripEventsElement, days.createTemplate());

const tripDaysElement = document.querySelector(`.trip-days`);

Object.keys(dateEvents).forEach((event, indexEvent) => {
  render(tripDaysElement, day.createTemplate(dateEvents[event], indexEvent));
});
