export default class Repository {
  constructor() {
    this._destinations = null;
    this._typesOffers = null;
  }

  static getDestination(city) {
    return this._destinations.find((destination) => destination.name === city);
  }

  static getCities() {
    return this._destinations.map((destination) => destination.name);
  }

  static getOffers(type) {
    return this._typesOffers
      .find((typeOffers) => typeOffers.type === type)
      .offers
      .sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
  }

  static setDestinations(destinations) {
    Repository._destinations = destinations;
  }

  static setTypesOffers(typesOffers) {
    Repository._typesOffers = typesOffers;
  }
}
