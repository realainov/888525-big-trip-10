const types = [
  {
    pic: `bus`,
    title: `Bus to`
  },
  {
    pic: `check-in`,
    title: `Check-in in`
  },
  {
    pic: `drive`,
    title: `Drive to`
  },
  {
    pic: `flight`,
    title: `Flight to`
  },
  {
    pic: `restaurant`,
    title: `Restaurant in`
  },
  {
    pic: `ship`,
    title: `Ship to`
  },
  {
    pic: `sightseeing`,
    title: `Sightseeing at`
  },
  {
    pic: `taxi`,
    title: `Taxi to`
  },
  {
    pic: `train`,
    title: `Train to`
  },
  {
    pic: `transport`,
    title: `Transport in`
  },
  {
    pic: `trip`,
    title: `Trip to`
  }
];

const cities = [`Tokyo`, `Kyoto`, `Auckland`, `Los Angeles`, `Christchurch`, `Wellington`, `Naha`];

const descriptions = [
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

const generateDescription = () => {
  return descriptions
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

const options = [
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

const generateOptions = () => {
  return options
    .map((item) => {
      return {
        name: item.name,
        type: item.type,
        price: generateNumber(200)
      };
    })
    .filter(() => Math.random() > 0.5)
    .slice(0, generateNumber(2));
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
    type: getRandomArrayItem(types),
    city: getRandomArrayItem(cities),
    photos: generatePhotos(),
    description: generateDescription(),
    price: generateNumber(200, 1),
    options: generateOptions(),
    time: {
      start: startDate,
      end: endDate
    }
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvents};
