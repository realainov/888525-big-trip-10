import {months} from "./const";

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : `${value}`;
};

export const getMarkupDate = (point) => {
  const currentMonth = months[point.time.start.getMonth()].substring(0, 3).toUpperCase();
  const currentDay = point.time.start.getDate();

  return `${currentMonth} ${currentDay}`;
};

export const calculateDuration = (duration) => {
  const result = duration / (1000 * 60);

  const minutes = result % 60;
  const hours = Math.floor(result / 60) % 24;
  const days = Math.floor(Math.floor(result / 60) / 24);

  if (days) {
    return `${castTimeFormat(days)}D ${castTimeFormat(hours)}H ${castTimeFormat(minutes)}M`;
  }

  if (hours) {
    return `${castTimeFormat(hours)}H ${castTimeFormat(minutes)}M`;
  }

  return `${castTimeFormat(minutes)}M`;
};
