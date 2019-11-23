import {day} from './components/day';
import {event} from './components/event';
import {eventEdit} from './components/event-edit';
import {filter} from './components/filter';
import {routeInfo} from './components/route-info';
import {siteMenu} from './components/site-menu';
import {tripSort} from './components/trip-sort';

const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfoElement = document.querySelector(`.trip-info`);

render(tripInfoElement, routeInfo.createTemplate(), `afterbegin`);

const tripControlsHeaderElements = document.querySelectorAll(`.trip-controls h2`);

render(tripControlsHeaderElements[0], siteMenu.createTemplate(), `afterend`);
render(tripControlsHeaderElements[1], filter.createTemplate(), `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, tripSort.createTemplate());
render(tripEventsElement, day.createTemplate());

const tripEventsListElement = document.querySelector(`.trip-events__list`);

render(tripEventsListElement, eventEdit.createTemplate());

new Array(TASK_COUNT).fill(``).forEach(() => render(tripEventsListElement, event.createTemplate()));
