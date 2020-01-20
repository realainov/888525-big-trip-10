import PointModel from '../models/point';
import Repository from '../models/repository';
import nanoid from 'nanoid';

const getSyncedPoints = (items) => items.filter(({success}) => success).map(({payload}) => payload.point);

export default class Provider {
  constructor(api, pointsStore, destinationsStore, typesOffersStore) {
    this._api = api;
    this._pointsStore = pointsStore;
    this._destinationsStore = destinationsStore;
    this._typesOffersStore = typesOffersStore;

    this._isSynchronized = true;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints().then((pointModels) => {
        pointModels.forEach((pointModel) => this._pointsStore.setItem(pointModel.id, pointModel.toRAW()));

        return pointModels;
      });
    }

    const storePoints = Object.values(this._pointsStore.getAll());

    this._isSynchronized = false;

    return Promise.resolve(storePoints.map((point) => new PointModel(point)));
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations().then((destinations) => {
        destinations.forEach((destination, index) => this._destinationsStore.setItem(index, destination));

        return destinations;
      });
    }

    const storeDestinations = Object.values(this._destinationsStore.getAll());

    this._isSynchronized = false;

    return Promise.resolve(Repository.setDestinations(storeDestinations));
  }

  getTypesOffers() {
    if (this._isOnLine()) {
      return this._api.getTypesOffers().then((typesOffers) => {
        typesOffers.forEach((typeOffers, index) => this._typesOffersStore.setItem(index, typeOffers));

        return typesOffers;
      });
    }

    const storeTypesOffers = Object.values(this._typesOffersStore.getAll());

    this._isSynchronized = false;

    return Promise.resolve(Repository.setTypesOffers(storeTypesOffers));
  }

  addPoint(pointModel) {
    if (this._isOnLine()) {
      return this._api.addPoint(pointModel)
        .then((newPointModel) => {
          this._pointsStore.setItem(newPointModel.id, newPointModel.toRAW());

          return newPointModel;
        });
    }

    const fakeNewPointId = nanoid();
    const fakeNewPoint = new PointModel(Object.assign({}, pointModel.toRAW(), {id: fakeNewPointId}));

    this._isSynchronized = false;

    this._pointsStore.setItem(fakeNewPoint.id, Object.assign({}, fakeNewPoint.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, pointModel) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, pointModel)
        .then((updatedPointModel) => {
          this._pointsStore.setItem(updatedPointModel.id, updatedPointModel.toRAW());

          return updatedPointModel;
        });
    }

    const fakeUpdatedPoint = new PointModel(Object.assign({}, pointModel.toRAW(), {id}));

    this._isSynchronized = false;
    this._pointsStore.setItem(id, Object.assign({}, fakeUpdatedPoint.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedPoint);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id)
        .then(() => {
          this._pointsStore.removeItem(id);
        });
    }

    this._isSynchronized = false;
    this._pointsStore.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storePoints = Object.values(this._pointsStore.getAll());

      return this._api.sync(storePoints)
        .then((response) => {
          storePoints
            .filter((point) => point.offline)
            .forEach((point) => {
              this._pointsStore.removeItem(point.id);
            });

          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          [...createdPoints, ...updatedPoints].forEach((point) => {
            this._pointsStore.setItem(point.id, point);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
