import AbstractComponent from './abstract-component';

const createFilterMarkup = (filter) => {
  const {name, isChecked} = filter;
  return (
    `<div class="trip-filters__filter">
      <input 
        id="filter-${name}" 
        class="trip-filters__filter-input  visually-hidden" 
        type="radio" 
        name="trip-filter" 
        value="${name}" 
        ${isChecked ? `checked` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-${name}">${name.toUpperCase()}</label>
    </div>`
  );
};

const createTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = evt.target.value;

      handler(filterName);
    });
  }
}
