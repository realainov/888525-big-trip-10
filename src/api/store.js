export default class Store {
  constructor(key) {
    this._storage = window.localStorage;

    this._storegeKey = key;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storegeKey));
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getAll();

    this._storage.setItem(this._storegeKey, JSON.stringify(Object.assign({}, store, {[key]: value})));
  }

  removeItem(key) {
    const store = this.getAll();

    delete store[key];

    this._storage.setItem(this._storegeKey, JSON.stringify(Object.assign({}, store)));
  }
}
