import { FilterObj } from './toys-i';

const filterObject: FilterObj = {
  sort: {
    choosed: 'default',
  },
  count: {
    start: 1,
    end: 12,
  },
  year: {
    start: 1940,
    end: 2020,
  },
  shape: {
    bell: false,
    ball: false,
    pine: false,
    snowflake: false,
    figure: false,
  },
  color: {
    white: false,
    yellow: false,
    red: false,
    blue: false,
    green: false,
  },
  size: {
    big: false,
    average: false,
    small: false,
  },
  favorite: {
    isFavorite: false,
  },
};

export default filterObject;
