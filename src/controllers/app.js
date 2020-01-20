import API from '../api';
import Store from '../api/store.js';
import Provider from '../api/provider.js';
import PointsModel from '../models/points';
import MenuComponent from '../components/menu';
import StatsComponent from '../components/stats';
import TripController from './trip';
import FilterController from './filter';
import RouteController from './route';
import {render, remove, RenderPosition} from '../utils/render';
import {MenuItems} from '../const';

const URL = `https://htmlacademy-es-10.appspot.com/big-trip`;
const AUTHORIZATION = `Basic eo0w590ik29889n`;

export default class AppController {
  constructor() {
    this._api = new API(URL, AUTHORIZATION);
    this._pointsStore = new Store(`big-trip-points-v1`);
    this._destinationsStore = new Store(`big-trip-destinations-v1`);
    this._typesOffersStore = new Store(`big-trip-types-offers-v1`);
    this._apiWithProvider = new Provider(this._api, this._pointsStore, this._destinationsStore, this._typesOffersStore);

    this._pointsModel = null;

    this._menuComponent = new MenuComponent();
    this._statsComponent = null;

    this._tripController = null;
    this._filterController = null;
    this._routeController = null;

    this._tripInfoElement = document.querySelector(`.trip-main`);
    this._addPointButtonElement = document.querySelector(`.trip-main__event-add-btn`);
    this._tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);
    this._pageContainerElement = document.querySelector(`main .page-body__container`);

    this._onMenuItemClick = this._onMenuItemClick.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._menuComponent.setMenuItemClickHandler(this._onMenuItemClick);
  }

  render() {
    window.addEventListener(`load`, () => {
      navigator.serviceWorker.register(`/sw.js`);
    });

    window.addEventListener(`online`, () => {
      document.title = document.title.replace(` [offline]`, ``);

      if (!this._apiWithProvider.getSynchronize()) {
        this._apiWithProvider.sync();
      }
    });

    window.addEventListener(`offline`, () => {
      document.title += ` [offline]`;
    });

    Promise.all([
      this._apiWithProvider.getPoints(),
      this._apiWithProvider.getDestinations(),
      this._apiWithProvider.getTypesOffers()
    ]).then((values) => {
      this._pointsModel = new PointsModel(values[0]);
      this._routeController = new RouteController(this._tripInfoElement, this._pointsModel);
      this._routeController.render();
      this._filterController = new FilterController(this._tripControlsHeaderElements[1], this._pointsModel);
      this._filterController.render();

      this._tripController = new TripController(this._pageContainerElement, this._pointsModel, this._apiWithProvider);
      this._tripController.render();

      this._tripController.setDataChangeHandler(this._onDataChange);

      render(this._tripControlsHeaderElements[0], this._menuComponent, RenderPosition.AFTEREND);

      this._addPointButtonElement.addEventListener(`click`, () => {
        this._filterController.render();
        this._tripController.render();
        this._tripController.createPoint();

        this._addPointButtonElement.disabled = true;
      });
    });
  }

  _onMenuItemClick(menuItem) {
    switch (menuItem) {
      case MenuItems.TABLE:
        this._statsComponent.destroyCharts();

        remove(this._statsComponent);

        this._filterController.render();
        this._tripController.render();

        this._addPointButtonElement.disabled = false;

        break;
      case MenuItems.STATS:
        this._tripController.destroy();
        this._filterController.destroy();

        const points = this._pointsModel.getAllPoints();

        this._statsComponent = new StatsComponent(points);

        render(this._pageContainerElement, this._statsComponent);

        this._statsComponent.renderCharts();

        this._addPointButtonElement.disabled = true;

        break;
    }
  }

  _onDataChange() {
    this._addPointButtonElement.disabled = false;
  }
}
