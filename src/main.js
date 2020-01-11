import PointsModel from './models/points';
import TripController from './controllers/trip';
import FilterComponent from './components/filter';
import SiteMenuComponent from './components/site-menu';
import RouteInfoComponent from './components/route-info';
import RouteCostComponent from './components/route-cost';
import FilterController from './controllers/filter';
import {FilterType} from './const';
import {generateEvents} from './data/points';
import {render, RenderPosition} from './utils/render';

const TASK_COUNT = 4;

const points = generateEvents(TASK_COUNT);

const pointsModel = new PointsModel(points);

const tripInfoElement = document.querySelector(`.trip-info`);

const routeInfoComponent = new RouteInfoComponent(points);
const routeCostComponent = new RouteCostComponent(points);

render(tripInfoElement, routeInfoComponent);
render(tripInfoElement, routeCostComponent);

const tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);
const siteMenuComponent = new SiteMenuComponent();

render(tripControlsHeaderElements[0], siteMenuComponent, RenderPosition.AFTEREND);

const filterController = new FilterController(tripControlsHeaderElements[1], pointsModel);

filterController.render();

const tripEventsElement = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEventsElement, pointsModel);

tripController.render();

const addPointButtonElement = document.querySelector(`.trip-main__event-add-btn`);

addPointButtonElement.addEventListener(`click`, () => {
  tripController.createPoint();
});


