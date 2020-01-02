import TripController from './controllers/trip';
import FilterComponent from './components/filter';
import SiteMenuComponent from './components/site-menu';
import RouteInfoComponent from './components/route-info';
import {filters} from './data/filter';
import {generateEvents} from './data/points';
import {render} from './utils/render';

const TASK_COUNT = 4;

const points = generateEvents(TASK_COUNT);

points.sort((a, b) => a.time.start - b.time.start);

const tripInfoElement = document.querySelector(`.trip-info`);

const routeInfoComponent = new RouteInfoComponent(points);

render(tripInfoElement, routeInfoComponent, `afterbegin`);

const tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);
const siteMenuComponent = new SiteMenuComponent();
const filterComponent = new FilterComponent(filters);

render(tripControlsHeaderElements[0], siteMenuComponent, `afterend`);
render(tripControlsHeaderElements[1], filterComponent, `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEventsElement);

tripController.render(points);
