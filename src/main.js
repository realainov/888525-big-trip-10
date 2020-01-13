import PointsModel from './models/points';
import TripController from './controllers/trip';
import SiteMenuComponent from './components/site-menu';
import RouteInfoComponent from './components/route-info';
import RouteCostComponent from './components/route-cost';
import FilterController from './controllers/filter';
import {generateEvents} from './data/points';
import {render, RenderPosition} from './utils/render';
import {MenuItems} from './const';

const TASK_COUNT = 4;

const points = generateEvents(TASK_COUNT);

const pointsModel = new PointsModel(points);

const tripInfoElement = document.querySelector(`.trip-info`);

const routeInfoComponent = new RouteInfoComponent(pointsModel);
const routeCostComponent = new RouteCostComponent(pointsModel);

render(tripInfoElement, routeInfoComponent);
render(tripInfoElement, routeCostComponent);

const tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);
const siteMenuComponent = new SiteMenuComponent();

siteMenuComponent.setMenuItemClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItems.TABLE:
      tripController.renderPoints();

      break;
    case MenuItems.STATS:
      tripController.renderStatistics();

      break;
  }
});

const addPointButtonElement = document.querySelector(`.trip-main__event-add-btn`);

addPointButtonElement.addEventListener(`click`, () => {
  tripController.createPoint();
});

render(tripControlsHeaderElements[0], siteMenuComponent, RenderPosition.AFTEREND);

const filterController = new FilterController(tripControlsHeaderElements[1], pointsModel);

filterController.render();

const pageContainerElement = document.querySelector(`main .page-body__container`);

const tripController = new TripController(pageContainerElement, pointsModel);

tripController.renderPoints();
