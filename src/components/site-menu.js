import AbstractComponent from './abstract-component';
import {MenuItems} from '../const';
import {makeWordCapitalize} from '../utils/common';

const createMenuItemsMarkup = (menuItems) => {
  return menuItems
    .map((menuItem, index) => {
      return `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${makeWordCapitalize(menuItem)}</a>`;
    })
    .join(`\n`);
};

const createTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs trip-tabs">
      ${createMenuItemsMarkup(Object.values(MenuItems))}
    </nav>`
  );
};

export default class SiteMenuComponent extends AbstractComponent {
  constructor() {
    super();

    this._currentMenuItem = MenuItems.TABLE;
  }

  getTemplate() {
    return createTemplate();
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

      const menuItemElements = this.findElements(`.trip-tabs__btn`);

      menuItemElements.forEach((menuItemElement) => {
        if (menuItemElement.textContent.toLowerCase() === this._currentMenuItem) {
          menuItemElement.classList.add(`trip-tabs__btn--active`);
        } else {
          menuItemElement.classList.remove(`trip-tabs__btn--active`);
        }
      });

      handler(this._currentMenuItem);
    });
  }
}
