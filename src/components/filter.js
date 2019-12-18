const createFilterMarkup = (filter, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input 
        id="filter-${filter.toLowerCase()}" 
        class="trip-filters__filter-input  visually-hidden" 
        type="radio" 
        name="trip-filter" 
        value="${filter.toLowerCase()}" 
        ${isChecked ? `checked` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-future">${filter}</label>
    </div>`
  );
};

const createTemplate = (filters) => {
  const filtersMarkup = filters.map((item, i) => createFilterMarkup(item, i === 0)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export const filter = {
  createTemplate
};
