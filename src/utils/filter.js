import {isFuturePoint, isPastPoint} from './common';
import {FilterType} from '../const';

export const getFuturePoints = (points) => {
  return points.filter((point) => {
    const date = point.date.from;

    return isFuturePoint(date);
  });
};

export const getPastPoints = (points) => {
  return points.filter((point) => {
    const date = point.date.from;

    if (!date) {
      return false;
    }

    return isPastPoint(date);
  });
};

export const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points);
    case FilterType.PAST:
      return getPastPoints(points);
  }

  return points;
};
