import data from '../data.json';
import { FilterObj } from '../pages/toys/toys-i';
import transltaeObj from './translate';
import { ToysData } from './utils-i';

class Utils {
  static stringToHtml(str: string): ChildNode {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(str, 'text/html');
    return <ChildNode>doc.body.firstChild;
  }

  static async fetchToysData<T>(): Promise<Awaited<T>> {
    const response = await fetch(data);
    let dataResponse = await response.json();
    dataResponse = dataResponse.map((toy: ToysData) => ({ ...toy, choosed: false }));
    return dataResponse;
  }

  static getArrayChoosedParam(obj: FilterObj[keyof FilterObj], isRange?: boolean): Array<string> {
    if (isRange) {
      const choosedParam = Object.entries(obj).map((item) => item[1]);
      return choosedParam;
    }
    const choosedParam = Object.entries(obj)
      .filter((param) => param[1])
      .map((item) => item[0]);
    return choosedParam;
  }

  static getFromLocalStorageFilterObj(): FilterObj | null {
    const localData = localStorage.getItem('walter-filters');
    if (localData) {
      return JSON.parse(localData);
    }
    return null;
  }

  static getFromLocalStorageChoosed(): Array<number> | null {
    const localData = localStorage.getItem('walter-choosed');
    if (localData) {
      return JSON.parse(localData);
    }
    return null;
  }

  static getFromLocalStorageTreeSetting(): {
      bg: number,
      tree: number
      snowflakes: boolean,
      sound: boolean,
    } | null {
    const localData = localStorage.getItem('walter-tree-setting');
    if (localData) {
      return JSON.parse(localData);
    }
    return null;
  }

  static clearHtmlInner(container: HTMLElement | null): void {
    if (container) {
      while ((<HTMLElement> container).firstChild) {
        (<HTMLElement> container).removeChild(
          <ChildNode>(<HTMLElement> container).firstChild,
        );
      }
    }
  }

  static getArrayFilterdByParam(
    mainArr: ToysData[],
    param: string,
    paramArr: Array<string>,
  ): ToysData[] {
    let filterArray = [...mainArr];
    if (param === 'favorite') {
      const isFavorite = paramArr?.includes('isFavorite');
      filterArray = filterArray.filter((toyObj) => {
        if (isFavorite) {
          return toyObj.favorite;
        }
        return true;
      });
      return filterArray;
    } if (param === 'count' || param === 'year') {
      const paramFromString = param.split('R')[0];
      filterArray = filterArray.filter(
        (toyObj) => toyObj[paramFromString] <= paramArr[1]
          && toyObj[paramFromString] >= paramArr[0],
      );
      return filterArray;
    }

    filterArray = filterArray.filter((toyObj) => {
      const engPropName = transltaeObj[<string>toyObj[param]];
      return (<Array<string>>paramArr).length
        ? (<Array<string>>paramArr).includes(engPropName)
        : true;
    });
    return filterArray;
  }

  static sortArrayByParam(arr: ToysData[], option: string): ToysData[] {
    const filteredArr = [...arr];
    filteredArr.sort((toy1, toy2) => {
      switch (option) {
        case 'a-to-z':
          if (toy1.name < toy2.name) {
            return -1;
          }
          if (toy1.name > toy2.name) {
            return 1;
          }
          return 0;
        case 'z-to-a':
          if (toy1.name < toy2.name) {
            return 1;
          }
          if (toy1.name > toy2.name) {
            return -1;
          }
          return 0;
        case 'asc':
          if (+toy1.count < +toy2.count) {
            return -1;
          }
          if (+toy1.count > +toy2.count) {
            return 1;
          }
          return 0;
        case 'desc':
          if (+toy1.count < +toy2.count) {
            return 1;
          }
          if (+toy1.count > +toy2.count) {
            return -1;
          }
          return 0;
        default:
          return 0;
      }
    });
    return filteredArr;
  }
}

export default Utils;
