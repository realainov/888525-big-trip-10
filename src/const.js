export const TYPE_GROUPS = {
  transport: [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  activity: [`check-in`, `restaurant`, `sightseeing`]
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
  'sightseeing': `Sightseeing in`,
  'trip': `Trip to`
};

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

export const MenuItems = {
  TABLE: `table`,
  STATS: `stats`
};
