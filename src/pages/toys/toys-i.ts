export type FilterPropTypes = {
  [key: string]: boolean | number | string;
};

export interface FilterObj {
  [key: string]: object;
  sort: {
    choosed: string;
  };
  count: {
    [key: string]: number;
    start: number;
    end: number;
  };
  year: {
    [key: string]: number;
    start: number;
    end: number;
  };
  shape: {
    [key: string]: boolean;
    bell: boolean;
    ball: boolean;
    pine: boolean;
    snowflake: boolean;
    figure: boolean;
  };
  color: {
    [key: string]: boolean;
    white: boolean;
    yellow: boolean;
    red: boolean;
    blue: boolean;
    green: boolean;
  };
  size: {
    [key: string]: boolean;
    big: boolean;
    average: boolean;
    small: boolean;
  };
  favorite: {
    [key: string]: boolean;
    isFavorite: boolean;
  };
}

export interface ChoosedOptionObject {
  [key: string]: Array<string>,
  shape: Array<string>;
  color: Array<string>;
  size: Array<string>;
  favorite: Array<string>;
  countRange: Array<string>;
  yearRange: Array<string>;
}
