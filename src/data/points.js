import {DESCRIPTIONS, TYPES, CITIES} from '../const';

export const generateDescription = () => {
  return DESCRIPTIONS
    .filter(() => Math.random() > 0.5)
    .slice(0, generateNumber(3, 1))
    .join(` `);
};

const generateDate = () => {
  const date = new Date();

  date.setDate(date.getDate() + generateNumber(7));

  date.setHours(generateNumber(23));
  date.setMinutes(generateNumber(59));

  return date;
};

const OPTIONS = [
  {
    name: `Add luggage`,
    type: `luggage`
  },
  {
    name: `Switch to comfort class`,
    type: `comfort`
  },
  {
    name: `Add meal`,
    type: `meal`
  },
  {
    name: `Choose seats`,
    type: `seats`
  }
];

export const generateOptions = () => {
  return OPTIONS
    .map((item) => {
      return {
        name: item.name,
        type: item.type,
        price: generateNumber(200)
      };
    })
    .filter(() => Math.random() > 0.5)
    .slice(0, generateNumber(3));
};

const generatePhotos = () => {
  return new Array(generateNumber(5))
    .fill(``)
    .map(() => {
      return `http://picsum.photos/300/150?r=${Math.random()}`;
    });
};

const generateNumber = (max, min = 0) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomArrayItem = (array) => {
  return array[generateNumber(array.length - 1)];
};

const generateEvent = () => {
  let startDate = generateDate();
  let endDate = generateDate();

  [startDate, endDate] = startDate > endDate ? [endDate, startDate] : [startDate, endDate];

  return {
    type: getRandomArrayItem(TYPES),
    city: getRandomArrayItem(CITIES),
    photos: generatePhotos(),
    description: generateDescription(),
    price: generateNumber(200, 1),
    options: generateOptions(),
    time: {
      start: startDate,
      end: endDate
    },
    isFavorite: !!generateNumber(1)
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvents};
