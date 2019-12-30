import TripController from './controllers/trip';
import FilterComponent from './components/filter';
import SiteMenuComponent from './components/site-menu';
import RouteInfoComponent from './components/route-info';
import {filters} from './data/filter';
import {generateEvents} from './data/event';
import {render} from './utils/render';
import {getMarkupDate} from './utils/common';

const TASK_COUNT = 4;

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

const routeInfoComponent = new RouteInfoComponent(dateEvents);

render(tripInfoElement, routeInfoComponent, `afterbegin`);

const tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);
const siteMenuComponent = new SiteMenuComponent();
const filterComponent = new FilterComponent(filters);

render(tripControlsHeaderElements[0], siteMenuComponent, `afterend`);
render(tripControlsHeaderElements[1], filterComponent, `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEventsElement);

tripController.render(dateEvents);
