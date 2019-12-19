import {event} from "./event";
import {eventEdit} from "./event-edit";
import {getMarkupDate} from "../utils";

const createTemplate = (date, indexDate) => {
  const markup = [];

  date.forEach((point, indexPoint) => {
    if (indexDate === 0 && indexPoint === 0) {
      markup.push(eventEdit.createTemplate(point));
    } else {
      markup.push(event.createTemplate(point));
    }
  });

  const dateTime = `${date[0].time.start.getFullYear()}-${date[0].time.start.getMonth()}-${date[0].time.start.getDate()}`;

  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${indexDate + 1}</span>
        <time class="day__date" datetime="${dateTime}">${getMarkupDate(date[0])}</time>
      </div>

      <ul class="trip-events__list">
        ${markup.join(`\n`)}
      </ul>
    </li>`
  );
};

export const day = {
  createTemplate
};
