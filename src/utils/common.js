import moment from 'moment';

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : `${value}`;
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDateTime = (date) => {
  return moment(date).format();
};

export const formatDate = (date) => {
  return moment(date).format(`DD/MM/YY`);
};

export const formatMarkupDate = (date) => {
  return moment(date).format(`MMM DD`);
};

export const makeWordCapitalize = (string) => {
  string = string.toString();

  return string[0].toUpperCase() + string.substring(1);
};

export const calculateDuration = (end, start) => {
  const result = (end - start) / (1000 * 60);

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
