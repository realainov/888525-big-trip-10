import RouteComponent from '../components/route';
import {render, replace, RenderPosition} from '../utils/render';

export default class RouteController {
  constructor(containerElement, pointsModel) {
    this._containerElement = containerElement;
    this._pointsModel = pointsModel;

    this._routeComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const points = this._pointsModel.getAllPoints();

    const oldComponent = this._routeComponent;

    this._routeComponent = new RouteComponent(points);

    if (oldComponent) {
      replace(this._routeComponent, oldComponent);
    } else {
      render(this._containerElement, this._routeComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
