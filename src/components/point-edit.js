import Repository from '../repository';
import AbstractSmartComponent from './abstract-smart-component';
import {makeWordCapitalize, makeWordWithDashes, formatTime, formatDate} from '../utils/common';
import {TYPE_GROUPS, typeMap, Mode} from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';
import lodash from 'lodash';

const createOffersMarkup = (offers) => {
  return offers
    .map((offer) => {
      const type = makeWordWithDashes(offer.title);

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}" type="checkbox" name="event-offer-${type}" ${offer.isChecked ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${type}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
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
        `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
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

const createTemplate = (point, tempPoint, destinations, typesOffers, isAddingMode) => {
  const {isFavorite} = point;
  const {destination: currentDestination, offers: selectedOffers, price: currentPrice, date, type: currentType} = tempPoint;

  const cities = Repository.getCities();
  const offers = Repository.getOffers(currentType);

  offers.forEach((offer) => {
    const equalOffer = selectedOffers.find((selectedOffer) => selectedOffer.title === offer.title);

    offer[`isChecked`] = !!equalOffer;

    offer.price = equalOffer ? equalOffer.price : offer.price;
  });

  const city = he.encode(currentDestination.name);
  const price = he.encode(currentPrice.toString());

  const startDate = formatDate(date.from);
  const endDate = formatDate(date.to);

  const startTime = formatTime(date.from);
  const endTime = formatTime(date.to);

  const typesMarkup = createTypeGroupMarkup(TYPE_GROUPS, currentType);
  const offersMarkup = createOffersMarkup(offers);
  const photosMarkup = createPhotosMarkup(currentDestination.pictures);
  const cityMarkup = createCityMarkup(cities, city);

  const isDisabledSaveButton = (!date.from || !date.to || !price || !currentDestination.name);

  return (
    `<form class="event  event--edit ${isAddingMode ? `trip-events__item` : ``}" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            ${typesMarkup}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${typeMap[currentType]}
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
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate} ${startTime}" readonly>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate} ${endTime}" readonly>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabledSaveButton ? `disabled` : ``}>Save</button>
        <button class="event__reset-btn" type="reset">${isAddingMode ? `Cancel` : `Delete`}</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        ${isAddingMode ? `` : `<button class="event__rollup-btn" type="button">
           <span class="visually-hidden">Open event</span>
         </button>`}
        
      </header>
      
      ${city || (offersMarkup && currentDestination.description) ? `<section class="event__details">

        ${offersMarkup ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>` : ``}
        
        ${currentDestination.description ? ` <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${currentDestination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photosMarkup}
            </div>
          </div>
        </section>` : ``}
      </section>` : ``}
    </form>`
  );
};

export default class PointEditComponent extends AbstractSmartComponent {
  constructor(point, mode) {
    super();

    this._point = point;
    this._mode = mode;

    this._tempPoint = lodash.cloneDeep(this._point);

    this._rollupButtonClickHandler = null;
    this._editFormSubmitHandler = null;
    this._deleteButtonClickHandler = null;

    this._startFlatpickr = null;
    this._endFlatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    const isClearRollupButton = this._mode === Mode.ADDING;

    return createTemplate(this._point, this._tempPoint, this._destinations, this._typesOffers, isClearRollupButton);
  }

  recoveryEventListeners() {
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setEditFormSubmitHandler(this._editFormSubmitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);

    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    this._tempPoint = lodash.cloneDeep(this._point);

    this.rerender();
  }

  getData() {
    const formData = new FormData(this.getElement());

    return this._parseFormData(formData);
  }

  setRollupButtonClickHandler(handler) {
    if (handler) {
      this.findElement(`.event__rollup-btn`).addEventListener(`click`, handler);

      this._rollupButtonClickHandler = handler;
    }
  }

  setEditFormSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._editFormSubmitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.findElement(`.event__reset-btn`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
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

    this._endFlatpickr = flatpickr(endDateElement, {
      enableTime: true,
      dateFormat: `d/m/Y H:i`,
      altInput: true,
      altFormat: `d/m/Y H:i`,
      minDate: startDateElement.value,
      mode: `single`
    });

    this._startFlatpickr = flatpickr(startDateElement, {
      enableTime: true,
      dateFormat: `d/m/Y H:i`,
      altInput: true,
      altFormat: `d/m/Y H:i`,
      mode: `single`,
      onClose: () => {
        this._endFlatpickr.set(`minDate`, startDateElement.value);

        this._tempPoint.date.to = this._endFlatpickr.selectedDates[0];
      }
    });
  }

  _subscribeOnEvents() {
    const eventTypeListElement = this.findElement(`.event__type-list`);

    eventTypeListElement.addEventListener(`change`, (evt) => {
      this._tempPoint.type = evt.target.value;
      this._tempPoint.offers = [];

      this.rerender();
    });

    const eventDestinationElement = this.findElement(`#event-destination-1`);

    eventDestinationElement.addEventListener(`change`, () => {
      if (Repository.getDestination(eventDestinationElement.value) === -1) {
        eventDestinationElement.value = this._tempPoint.destination.name;
      } else {
        this._tempPoint.destination = Repository.getDestination(eventDestinationElement.value);

        this.rerender();
      }
    });

    const startDateElement = this.findElement(`#event-start-time-1`);

    startDateElement.addEventListener(`change`, () => {
      this._tempPoint.date.from = this._startFlatpickr.selectedDates[0];
    });

    const endDateElement = this.findElement(`#event-end-time-1`);

    endDateElement.addEventListener(`change`, () => {
      this._tempPoint.date.to = this._endFlatpickr.selectedDates[0];
    });

    const eventPriceElement = this.findElement(`#event-price-1`);

    eventPriceElement.addEventListener(`change`, () => {
      this._tempPoint.price = eventPriceElement.value;

      this.rerender();
    });

    const eventFavoriteButtonElement = this.findElement(`#event-favorite-1`);

    eventFavoriteButtonElement.addEventListener(`change`, () => {
      this._point.isFavorite = !this._point.isFavorite;

      this.rerender();
    });

    this.findElements(`.event__offer-selector`).forEach((element) => {
      element.addEventListener(`change`, () => {
        if (element.querySelector(`.event__offer-checkbox`).checked) {
          this._tempPoint.offers.push({
            title: element.querySelector(`.event__offer-title`).textContent,
            price: element.querySelector(`.event__offer-price`).textContent
          });
        } else {
          const index = this._tempPoint.offers.findIndex((offer) => offer.title === element.querySelector(`.event__offer-title`).textContent);

          this._tempPoint.offers = [
            ...this._tempPoint.offers.slice(0, index),
            ...this._tempPoint.offers.slice(index + 1)
          ];
        }
      });
    });
  }

  _parseFormData(formData) {
    const offers = Array.from(this.findElements(`.event__offer-selector`))
      .filter((element) => element.querySelector(`.event__offer-checkbox`).checked)
      .map((element) => {
        return {
          title: element.querySelector(`.event__offer-title`).textContent,
          price: +element.querySelector(`.event__offer-price`).textContent
        };
      });

    const photos = Array.from(this.findElements(`.event__photo`)).map((element) => {
      return {
        src: element.src,
        description: element.alt
      };
    });

    const startDate = this._startFlatpickr.selectedDates[0];
    const endDate = this._endFlatpickr.selectedDates[0];

    return {
      [`destination`]: {
        [`name`]: formData.get(`event-destination`),
        [`description`]: this.findElement(`.event__destination-description`).textContent,
        [`pictures`]: photos
      },
      [`is_favorite`]: Boolean(formData.get(`event-favorite`)),
      [`offers`]: offers,
      [`base_price`]: +formData.get(`event-price`),
      [`date_from`]: new Date(startDate),
      [`date_to`]: new Date(endDate),
      [`type`]: formData.get(`event-type`)
    };
  }
}
