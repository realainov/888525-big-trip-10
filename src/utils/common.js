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
  return moment(date).format(`DD/MM/YYYY`);
};

export const formatMarkupDate = (date) => {
  return moment(date).format(`MMM DD`);
};

export const makeWordCapitalize = (string) => {
  string = string.toString();

  return string[0].toUpperCase() + string.substring(1);
};

export const makeWordWithDashes = (string) => {
  string = string.toString().toLowerCase();

  return string.split(` `).join(`-`);
};

export const calculateDuration = (duration) => {
  const result = Math.floor(duration / (1000 * 60));

  let minutes = result % 60;
  let hours = Math.floor(result / 60) % 24;
  let days = Math.floor(Math.floor(result / 60) / 24);

  minutes = minutes !== 0 ? `${castTimeFormat(minutes)}M` : ``;
  hours = hours !== 0 ? `${castTimeFormat(hours)}H ` : ``;
  days = days !== 0 ? `${castTimeFormat(days)}D ` : ``;

  return `${days}${hours}${minutes}`;
};

export const isFuturePoint = (date) => {
  const todayDate = new Date();

  return date > todayDate && !isOneDay(date);
};

export const isPastPoint = (date) => {
  const todayDate = new Date();

  return date < todayDate && !isOneDay(date);
};

export const isOneDay = (dateA, dateB = new Date()) => {
  const momentDateA = moment(dateA);
  const momentDateB = moment(dateB);

  return momentDateA.diff(momentDateB, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

export const generateString = (quantity) => {
  let rnd = ``;

  while (rnd.length < quantity) {
    rnd += Math.random().toString(36).substring(2);
  }

  return rnd.substring(0, quantity);
};
