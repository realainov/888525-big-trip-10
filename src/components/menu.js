import AbstractSmartComponent from './abstract-smart-component';
import {MenuItems} from '../const';
import {makeWordCapitalize} from '../utils/common';

const createMenuItemsMarkup = (menuItems, currentMenuItem) => {
  return menuItems
    .map((menuItem) => {
      return `<a class="trip-tabs__btn ${menuItem === currentMenuItem ? `trip-tabs__btn--active` : ``}" href="#">${makeWordCapitalize(menuItem)}</a>`;
    })
    .join(`\n`);
};

const createTemplate = (currentMenuItem) => {
  return (
    `<nav class="trip-controls__trip-tabs trip-tabs">
      ${createMenuItemsMarkup(Object.values(MenuItems), currentMenuItem)}
    </nav>`
  );
};

export default class MenuComponent extends AbstractSmartComponent {
  constructor() {
    super();

    this._currentMenuItem = MenuItems.TABLE;

    this._menuItemClickHandler = null;
  }

  getTemplate() {
    return createTemplate(this._currentMenuItem);
  }

  recoveryEventListeners() {
    this.setMenuItemClickHandler(this._menuItemClickHandler);
  }

  rerender() {
    super.rerender();

    this.recoveryEventListeners();
  }

  setMenuItemClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      if (this._currentMenuItem === evt.target.textContent.toLowerCase()) {
        return;
      }

      this._currentMenuItem = evt.target.textContent.toLowerCase();

      handler(this._currentMenuItem);

      this._menuItemClickHandler = handler;

      this.rerender();
    });
  }
}
