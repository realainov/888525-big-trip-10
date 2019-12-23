import {createElement, castTimeFormat, makeWordCapitalize} from "../utils";
import {TYPES} from "../const";

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
          <input id="event-type-${type.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}" ${currentType === type ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}-1">${makeWordCapitalize(type.name)}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createTypeGroupMarkup = (types, currentType) => {
  return Object.entries(types)
    .map((group) => {
      const groupName = group[0];
      const groupTypes = group[1];

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

const createTemplate = (point) => {
  const {type, city, photos, description, price, options, time} = point;

  const startDate = `${time.start.getDate()}/${time.start.getMonth() + 1}/${(time.start.getFullYear()).toString().substring(2)}`;
  const endDate = `${time.end.getDate()}/${time.end.getMonth() + 1}/${time.end.getFullYear().toString().substring(2)}`;

  const startTime = `${castTimeFormat(time.start.getHours())}:${castTimeFormat(time.start.getMinutes())}`;
  const endTime = `${castTimeFormat(time.end.getHours())}:${castTimeFormat(time.end.getMinutes())}`;

  const typesMarkup = createTypeGroupMarkup(TYPES, type);
  const optionsMarkup = createOptionsMarkup(options);
  const photosMarkup = createPhotosMarkup(photos);

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.name}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${typesMarkup}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type.title}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
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

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
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

export default class PointEdit {
  constructor(point) {
    this._element = null;
    this._point = point;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(createTemplate(this._point));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
