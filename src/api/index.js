import PointModel from '../models/point.js';
import Repository from '../models/repository';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(url, authorization) {
    this._url = url;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({path: `points`})
      .then((response) => response.json())
      .then((points) => points.map((point) => new PointModel(point)));
  }

  getDestinations() {
    return this._load({path: `destinations`})
      .then((response) => response.json())
      .then((destinations) => {
        Repository.setDestinations(destinations);

        return destinations;
      });
  }

  getTypesOffers() {
    return this._load({path: `offers`})
      .then((response) => response.json())
      .then((typesOffers) => {
        Repository.setTypesOffers(typesOffers);

        return typesOffers;
      });
  }

  updatePoint(id, pointModel) {
    return this._load({
      path: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(pointModel.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((point) => new PointModel(point));
  }

  addPoint(pointModel) {
    return this._load({
      path: `points`,
      method: Method.POST,
      body: JSON.stringify(pointModel.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((point) => new PointModel(point));
  }

  deletePoint(id) {
    return this._load({
      path: `points/${id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      path: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  _load({path, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._url}/${path}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
