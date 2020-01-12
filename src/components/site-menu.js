import AbstractSmartComponent from './abstract-component';
import {MenuType} from '../const';
import {makeWordCapitalize} from '../utils/common';

const createSiteMenuMarkup = (menuItems) => {
  return menuItems
    .map((menuItem, index) => {
      return `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${makeWordCapitalize(menuItem)}</a>`;
    })
    .join(`\n`);
};

const createTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs trip-tabs">
      ${createSiteMenuMarkup(Object.values(MenuType))}
    </nav>`
  );
};

export default class SiteMenuComponent extends AbstractSmartComponent {
  constructor(menuItems) {
    super();

    this._menuItems = menuItems;
    this._currentMenuItem = `Table`;

    this._menuItemClickHandler = null;
  }

  getTemplate() {
    return createTemplate(this._menuItems);
  }

  rerender() {
    super.rerender();
  }

  recoveryEventListeners() {
    this.setMenuItemClickHandler(this._menuItemClickHandler);
  }

  setMenuItemClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      if (this._currentMenuItem === evt.target.textContent) {
        return;
      }

      this._currentMenuItem = evt.target.textContent;

      const menuItemElements = this.findElements(`.trip-tabs__btn`);

      menuItemElements.forEach((menuItemElement) => {
        if (menuItemElement.textContent === this._currentMenuItem) {
          menuItemElement.classList.add(`trip-tabs__btn--active`);
        } else {
          menuItemElement.classList.remove(`trip-tabs__btn--active`);
        }
      });

      handler(this._currentMenuItem);

      this._menuItemClickHandler = handler;
    });
  }
}
