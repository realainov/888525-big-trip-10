import AbstractSmartComponent from './abstract-smart-component';
import {makeWordCapitalize, formatTime, formatDate} from '../utils/common';
import {TYPE_GROUPS, typeMap, CITIES} from '../const';
import {generateDescription, generateOptions} from '../data/points';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createOptionsMarkup = (options) => {
  return options
    .map((option) => {
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.type}-1" type="checkbox" name="event-offer-luggage" checked>
          <label class="event__offer-label" for="event-offer-luggage-1">
            <span class="event__offer-title">${option.name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createTypesMarkup = (types, currentType) => {
  return types
    .map((type) => {
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${makeWordCapitalize(type)}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createTypeGroupMarkup = (types, currentType) => {
  return Object.entries(types)
    .map((group) => {
      const [groupName, groupTypes] = group;

      return (
        `<fieldset class="event__type-group">
          <legend class="visually-hidden">${makeWordCapitalize(groupName)}</legend>
  
          ${createTypesMarkup(groupTypes, currentType)}
        </fieldset>`
      );
    })
    .join(`\n`);
};

const createPhotosMarkup = (photos) => {
  return photos
    .map((photo) => {
      return (
        `<img class="event__photo" src="${photo}" alt="Event photo">`
      );
    })
    .join(`\n`);
};

const createCityMarkup = (cities) => {
  return cities
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    })
    .join(`\n`);
};

const createTemplate = (point, addOptions) => {
  const {photos, price, isFavorite} = point;
  const {city, description, options, type, time} = addOptions;

  const startDate = formatDate(time.start);
  const endDate = formatDate(time.end);

  const startTime = formatTime(time.start);
  const endTime = formatTime(time.end);

  const typesMarkup = createTypeGroupMarkup(TYPE_GROUPS, type);
  const optionsMarkup = createOptionsMarkup(options);
  const photosMarkup = createPhotosMarkup(photos);
  const cityMarkup = createCityMarkup(CITIES);

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${typesMarkup}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${typeMap[type]}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1" autocomplete="off">
            <datalist id="destination-list-1">
              ${cityMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate} ${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate} ${endTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">

          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${optionsMarkup}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosMarkup}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class PointEditComponent extends AbstractSmartComponent {
  constructor(point) {
    super();

    this._point = point;

    this._addOptions = {
      description: point.description,
      city: point.city,
      options: point.options,
      type: point.type,
      time: {
        start: point.time.start,
        end: point.time.end
      }
    };

    this._rollupButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._editFormSubmitHandler = null;

    this._startFlatpickr = null;
    this._endFlatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTemplate(this._point, this._addOptions);
  }

  recoveryEventListeners() {
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setFavoriteCheckboxChangeHandler(this._favoriteButtonClickHandler);
    this.setEditFormSubmitHandler(this._editFormSubmitHandler);

    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;

    this._addOptions = {
      description: point.description,
      city: point.city,
      options: point.options,
      type: point.type,
      time: {
        start: point.time.start,
        end: point.time.end
      }
    };

    this.rerender();
  }

  setRollupButtonClickHandler(handler) {
    this.findElement(`.event__rollup-btn`).addEventListener(`click`, handler);

    this._rollupButtonClickHandler = handler;
  }

  setFavoriteCheckboxChangeHandler(handler) {
    this.findElement(`.event__favorite-checkbox`).addEventListener(`change`, handler);

    this._favoriteButtonClickHandler = handler;
  }

  setEditFormSubmitHandler(handler) {
    this.findElement(`form`).addEventListener(`submit`, handler);

    this._editFormSubmitHandler = handler;
  }

  _applyFlatpickr() {
    if (this._startFlatpickr) {
      this._startFlatpickr.destroy();
      this._startFlatpickr = null;
    }

    if (this._endFlatpickr) {
      this._endFlatpickr.destroy();
      this._endFlatpickr = null;
    }

    const startDateElement = this.findElement(`#event-start-time-1`);
    const endDateElement = this.findElement(`#event-end-time-1`);

    this._startFlatpickr = flatpickr(startDateElement, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: this._addOptions.time.start
    });

    this._endFlatpickr = flatpickr(endDateElement, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: this._addOptions.time.end
    });
  }

  _subscribeOnEvents() {
    const eventTypeListElement = this.findElement(`.event__type-list`);

    eventTypeListElement.addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      this._addOptions.type = evt.target.value;
      this._addOptions.description = generateDescription();
      this._addOptions.options = generateOptions();

      this.rerender();
    });

    const eventDestinationElement = this.findElement(`#event-destination-1`);

    eventDestinationElement.addEventListener(`focus`, () => {
      eventDestinationElement.removeAttribute(`value`);

      eventDestinationElement.addEventListener(`change`, () => {
        this._addOptions.city = eventDestinationElement.value;

        this.rerender();
      });
    });
  }
}
