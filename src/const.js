export const TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`, `trip`];

export const TYPE_GROUPS = {
  transport: [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  activity: [`check-in`, `restaurant`, `sightseeing`, `trip`]
};

export const typeMap = {
  'bus': `Bus to`,
  'drive': `Drive to`,
  'flight': `Flight to`,
  'ship': `Ship to`,
  'taxi': `Taxi to`,
  'train': `Train to`,
  'transport': `Transport in`,
  'check-in': `Check-in in`,
  'restaurant': `Restaurant in`,
  'sightseeing': `Sightseeing at`,
  'trip': `Trip to`
};

export const CITIES = [`Tokyo`, `Kyoto`, `Auckland`, `Los Angeles`, `Christchurch`, `Wellington`, `Naha`];

export const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};
