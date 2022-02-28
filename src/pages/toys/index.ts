import noUiSlider from 'nouislider';
import Page from '../../core/templates/page';
import { ToysData } from '../../utils/utils-i';
import PageNames from '../../utils/page-names';
import Utils from '../../utils/utils';
import { FilterObj, FilterPropTypes } from './toys-i';
import oneToyWrapper from './one-toy-wrapper.html';
import filterObject from './filterObject';
import './style.scss';
import '../../styles/nouislider.scss';

class ToysPage extends Page {
  private toysData: ToysData[] | [] = [];

  public yourChoosedArray: Array<number> = [];

  public filterObj: FilterObj = { ...filterObject };

  private countSlider: noUiSlider.Instance | null = null;

  private yearSlider: noUiSlider.Instance | null = null;

  private searchInput: HTMLInputElement | null = (<HTMLElement> this.container).querySelector(
    '.search-input',
  );

  private clearSearch: HTMLButtonElement | null = (<HTMLElement> this.container).querySelector(
    '.clear-search',
  );

  private sortSelect: HTMLSelectElement | null = (<HTMLElement> this.container).querySelector(
    '#sort-input',
  );

  private toysItemsWrapper: HTMLElement | null = (<HTMLElement>(
    this.container
  )).querySelector('.toys-list');

  private filterButtons: NodeListOf<HTMLButtonElement> | null = (<HTMLElement> this.container)
    .querySelectorAll(
      'button[data-option="filter"]',
    );

  constructor() {
    super(PageNames.TOYS_PAGE);
    this.setDataToys();
    this.addFilterHandlers();
    this.getChoosedFavoriteArrayFromLocal();
  }

  public setChoosedCountInHeader(): void {
    const toysChoosedSpanContainer = <HTMLElement>(
      document.querySelector('.choosed-toys-count')
    );
    if (toysChoosedSpanContainer) {
      const favoriteCount = this.yourChoosedArray.length.toLocaleString();
      toysChoosedSpanContainer.textContent = favoriteCount;
    }
  }

  private getChoosedFavoriteArrayFromLocal(): void {
    const data = Utils.getFromLocalStorageChoosed();
    if (data) {
      this.yourChoosedArray = [...data];
    }
  }

  public focusOnSearch(): void {
    this.searchInput?.focus();
    this.searchInput?.select();
  }

  private async setDataToys(): Promise<void> {
    this.toysData = await Utils.fetchToysData<ToysData[]>();
    const localData = Utils.getFromLocalStorageFilterObj();
    if (localData) {
      this.filterObj = { ...localData };
      const filteredArr = this.getFilteredArrayByParam(
        localData,
        this.toysData,
      );
      const option = this.filterObj.sort.choosed;
      const sortedArray = Utils.sortArrayByParam(filteredArr, option);
      this.selectOption(option);
      this.addStylesToChoosedFilterButton();
      this.renderToysItems(sortedArray);
    } else {
      this.renderToysItems(this.toysData);
    }
  }

  private selectOption(option: string): void {
    Array.from((<HTMLSelectElement> this.sortSelect)?.childNodes).forEach((item) => {
      if ((<HTMLOptionElement>item).value) {
        if ((<HTMLOptionElement>item).value === option) {
          (<HTMLOptionElement>item).selected = true;
        } else {
          (<HTMLOptionElement>item).selected = false;
        }
      }
    });
  }

  public addStylesToChoosedFilterButton(): void {
    for (let index = 0; index < (<NodeListOf<HTMLButtonElement>> this.filterButtons)
      .length; index += 1) {
      const element = (<NodeListOf<HTMLButtonElement>> this.filterButtons)[index];
      const { type, criterion } = (<HTMLButtonElement> element).dataset;
      if (type && criterion) {
        if ((<FilterPropTypes> this.filterObj[criterion])[type]) {
          element.classList.add('active');
        }
      }
    }
  }

  public renderTwoUiSlider(
    countStart: number,
    countEnd: number,
    yearStart: number,
    yearEnd: number,
  ): void {
    const countSliderWrapper = <noUiSlider.Instance>(
      (<HTMLElement> this.container).querySelector('.uiSliderCountWrapper')
    );
    const spanCountCollection = <NodeListOf<HTMLSpanElement>>(
      (<HTMLElement> this.container).querySelectorAll('.count-slider-span')
    );
    const yearSliderWrapper = <noUiSlider.Instance>(
      (<HTMLElement> this.container).querySelector('.ui-slider-year')
    );
    const spanYearCollection = <NodeListOf<HTMLSpanElement>>(
      (<HTMLElement> this.container).querySelectorAll('.year-slider-span')
    );
    this.countSlider = this.createUiSlider(
      countStart,
      countEnd,
      1,
      countSliderWrapper,
      spanCountCollection,
      true,
    );
    this.yearSlider = this.createUiSlider(
      yearStart,
      yearEnd,
      10,
      yearSliderWrapper,
      spanYearCollection,
      false,
    );
  }

  private renderToysItems(toys: ToysData[]): void {
    const container: HTMLElement = <HTMLElement>(<HTMLElement> this.container).querySelector(
      '.empty-container',
    );
    Utils.clearHtmlInner(this.toysItemsWrapper);
    Utils.clearHtmlInner(container);
    if (toys.length) {
      toys.forEach((toy) => {
        this.createToyItem(toy);
      });
    } else {
      this.showEmptyMessage(container);
    }
  }

  private showEmptyMessage(container: HTMLElement): void {
    const emptyMessageHead = document.createElement('h3');
    emptyMessageHead.textContent = 'Извините, совпадений не обнаружено';
    (<HTMLElement>container).append(emptyMessageHead);
  }

  private createToyItem(toy: ToysData): void {
    const nodeOneToyWrapper = Utils.stringToHtml(oneToyWrapper);
    const nameWrapper = <HTMLHeadElement>(
      (<HTMLElement>nodeOneToyWrapper).querySelector('h3')
    );
    const spanInfoWrappers = <NodeListOf<HTMLSpanElement>>(
      (<HTMLElement>nodeOneToyWrapper).querySelectorAll('span')
    );
    const toyImageWrapper = (<HTMLElement>nodeOneToyWrapper).querySelector(
      '.toys-list__item__img',
    );
    const infoArray: Array<string> = Object.keys(toy);

    if (this.yourChoosedArray.includes(+toy.num)) {
      if (!(<HTMLElement>nodeOneToyWrapper).classList.contains('active')) {
        (<HTMLElement>nodeOneToyWrapper).classList.add('active');
      }
    }

    for (let index = 0; index < infoArray.length; index += 1) {
      const element = infoArray[index];
      const span = spanInfoWrappers[index - 2];
      switch (element) {
        case 'num':
          (<HTMLElement>(
              toyImageWrapper
            )).style.backgroundImage = `url(./assets/toys/${toy[element]}.png)`;
          break;
        case 'name':
          nameWrapper.textContent = toy[element];
          break;
        case 'favorite':
          span.textContent = toy[element] ? 'да' : 'нет';
          break;
        case 'choosed':
          if (toy[element]) {
            (<HTMLElement>nodeOneToyWrapper).classList.add('active');
          }
          break;
        default:
          span.textContent = toy[element].toString();
          break;
      }
    }

    nodeOneToyWrapper.addEventListener('click', (event) => {
      this.toyClickHandler(event, toy);
    });

    (<HTMLElement> this.toysItemsWrapper).append(nodeOneToyWrapper);
  }

  private toyClickHandler(event: Event, toy: ToysData): void {
    const toyItem = (<HTMLElement>event.currentTarget);
    const isContainsActiveClass = toyItem.classList.contains('active');
    if (this.yourChoosedArray.includes(+toy.num)) {
      if (isContainsActiveClass) {
        toyItem.classList.remove('active');
        this.yourChoosedArray = this.yourChoosedArray.filter((item) => item !== +toy.num);
      }
    } else if (this.yourChoosedArray.length <= 19) {
      if (!isContainsActiveClass) {
        toyItem.classList.add('active');
        this.yourChoosedArray = [...this.yourChoosedArray, +toy.num];
      }
    } else {
      this.showPopup();
    }
    this.setChoosedCountInHeader();
  }

  private showPopup(): void {
    const popupWrapper = document.querySelector('.popup');
    if (!popupWrapper?.classList.contains('active')) {
      popupWrapper?.classList.add('active');
      setTimeout(() => {
        popupWrapper?.classList.remove('active');
      }, 5000);
    }
  }

  private addFilterHandlers(): void {
    const filterAndResetButtons = (<HTMLElement> this.container).querySelectorAll(
      'button[data-option="filter"], button[data-option="reset-filter"], button[data-option="reset-local"]',
    );

    filterAndResetButtons.forEach((filterBtn) => {
      filterBtn.addEventListener('click', (event: Event) => {
        (<HTMLElement>event.currentTarget).classList.toggle('active');
        const { option, criterion, type } = (<HTMLElement>event.currentTarget).dataset;
        if (option) {
          this.filterHandler(option, criterion, type);
        }
      });
    });

    (<HTMLInputElement> this.searchInput).addEventListener('input', (event) => {
      const { value } = <HTMLInputElement> event.currentTarget;
      if (value) {
        this.searchHandler(value);
        this.clearSearch?.classList.add('active');
      } else {
        let filteredArr = this.getFilteredArrayByParam(
          this.filterObj,
          this.toysData,
        );
        const option = this.filterObj.sort.choosed;
        filteredArr = Utils.sortArrayByParam(filteredArr, option);
        this.renderToysItems(filteredArr);
        this.clearSearch?.classList.remove('active');
      }
    });

    this.clearSearch?.addEventListener('click', () => {
      (<HTMLInputElement> this.searchInput).value = '';
      this.clearSearch?.classList.remove('active');
      let filteredArr = this.getFilteredArrayByParam(
        this.filterObj,
        this.toysData,
      );
      const option = this.filterObj.sort.choosed;
      filteredArr = Utils.sortArrayByParam(filteredArr, option);
      this.renderToysItems(filteredArr);
    });

    this.sortSelect?.addEventListener('change', (event) => {
      const sortOPtion = (<HTMLSelectElement>event.target).value;
      this.sortHandler(sortOPtion);
    });
  }

  private sortHandler(option: string): void {
    let filteredArr = this.getFilteredArrayByParam(
      this.filterObj,
      this.toysData,
    );

    if ((<HTMLInputElement> this.searchInput).value) {
      filteredArr = this.searchFilter(
        filteredArr,
        (<HTMLInputElement> this.searchInput).value,
      );
    }
    this.filterObj.sort.choosed = option;
    const sortedArray = Utils.sortArrayByParam(filteredArr, option);
    this.renderToysItems(sortedArray);
  }

  private searchHandler(value: string): void {
    let filteredArr = this.getFilteredArrayByParam(
      this.filterObj,
      this.toysData,
    );
    filteredArr = this.searchFilter(filteredArr, value);
    const option = this.filterObj.sort.choosed;
    filteredArr = Utils.sortArrayByParam(filteredArr, option);
    this.renderToysItems(filteredArr);
  }

  private searchFilter(arr: ToysData[], value: string): ToysData[] {
    let filteredArr = [...arr];
    filteredArr = filteredArr.filter((item) => item.name
      .toLocaleLowerCase().includes(value.toLocaleLowerCase()));
    return filteredArr;
  }

  private setDefaultParametresFilter() {
    const objectOuterKeys = Object.keys(this.filterObj);
    for (let index = 0; index < objectOuterKeys.length; index += 1) {
      const variable = objectOuterKeys[index];
      const objectInnerKeys = Object.keys(this.filterObj[variable]);
      for (let index2 = 0; index2 < objectInnerKeys.length; index2 += 1) {
        const innerVariable = objectInnerKeys[index2];
        if (variable === 'count') {
          this.filterObj[variable][innerVariable] = innerVariable === 'start' ? 1 : 12;
        } else if (variable === 'year') {
          this.filterObj[variable][innerVariable] = innerVariable === 'start' ? 1940 : 2020;
        } else if (
          typeof (<FilterPropTypes> this.filterObj[variable])[innerVariable] === 'boolean'
        ) {
          if ((<FilterPropTypes> this.filterObj[variable])[innerVariable]) {
            (<FilterPropTypes> this.filterObj[variable])[innerVariable] = false;
          }
        } else if (variable === 'sort') {
          (<FilterPropTypes> this.filterObj[variable])[innerVariable] = 'default';
        }
      }
    }
  }

  private updateToys(type: string, criterion: string, valueArr?: Array<number>): void {
    let updatedFilterObj: FilterObj;

    if (valueArr) {
      updatedFilterObj = this.updateFilterToys(type, criterion, valueArr);
    } else {
      updatedFilterObj = this.updateFilterToys(type, criterion);
    }

    let filteredArr = this.getFilteredArrayByParam(
      updatedFilterObj,
      this.toysData,
    );
    const choosedSort = this.filterObj.sort.choosed;
    filteredArr = Utils.sortArrayByParam(filteredArr, choosedSort);

    if ((<HTMLInputElement> this.searchInput).value) {
      filteredArr = this.searchFilter(
        filteredArr,
        (<HTMLInputElement> this.searchInput).value,
      );
    }
    this.renderToysItems(filteredArr);
  }

  private resetFilters(): void {
    const choosedSort = this.filterObj.sort.choosed;
    this.setDefaultParametresFilter();
    this.filterObj.sort.choosed = choosedSort;

    let filteredArr = Utils.sortArrayByParam(this.toysData, choosedSort);
    if ((<HTMLInputElement> this.searchInput).value) {
      filteredArr = this.searchFilter(
        filteredArr,
        (<HTMLInputElement> this.searchInput).value,
      );
    }
    this.removeAllStylesFromButtons();
    this.resetSliders();
    this.renderToysItems(filteredArr);
    this.setChoosedCountInHeader();
  }

  private resetLocal(): void {
    this.yourChoosedArray = [];
    (<HTMLInputElement> this.searchInput).value = '';
    if (this.clearSearch?.classList.contains('active')) {
      this.clearSearch.classList.remove('active');
    }
    if (Utils.getFromLocalStorageFilterObj()) {
      localStorage.removeItem('walter-filters');
      localStorage.removeItem('walter-choosed');
    }
    this.setDefaultParametresFilter();
    this.selectOption('default');
    this.removeAllStylesFromButtons();
    this.resetSliders();
    this.renderToysItems(this.toysData);
    this.setChoosedCountInHeader();
  }

  private filterHandler(
    option: string,
    criterion?: string,
    type?: string,
    valueArr?: Array<number>,
  ): void {
    if (option === 'filter' && type && criterion) {
      this.updateToys(type, criterion);
    } else if (option === 'reset-filter') {
      this.resetFilters();
    } else if (option === 'reset-local') {
      this.resetLocal();
    } else if (option === 'count-range') {
      this.updateToys('start', 'count', valueArr);
    } else if (option === 'year-range') {
      this.updateToys('start', 'year', valueArr);
    }
  }

  private resetSliders(): void {
    (<noUiSlider.Instance> this.countSlider).noUiSlider.set([1, 12]);
    (<noUiSlider.Instance> this.yearSlider).noUiSlider.set([1940, 2020]);
  }

  private removeAllStylesFromButtons(): void {
    for (let index = 0; index < (<NodeListOf<HTMLButtonElement>> this.filterButtons)
      .length; index += 1) {
      const element = (<NodeListOf<HTMLButtonElement>> this.filterButtons)[index];
      if (element.classList.contains('active')) {
        element.classList.remove('active');
      }
    }
  }

  private getFilteredArrayByParam(
    filterObj: FilterObj,
    array: ToysData[],
  ): ToysData[] {
    let filteringArray: ToysData[] | [] = [...array];
    const allChoosedOtionObject: Array<string> = Object.keys(this.filterObj).filter((key) => key !== 'sort');

    for (let index = 0; index < allChoosedOtionObject.length; index += 1) {
      const key = allChoosedOtionObject[index];
      const isRange = (key === 'count' || key === 'year');
      const arr = Utils.getArrayChoosedParam(filterObj[key], isRange);
      filteringArray = Utils.getArrayFilterdByParam(filteringArray, key, arr);
    }
    return filteringArray;
  }

  public createUiSlider(
    min: number,
    max: number,
    step: number,
    uiSliderWrapper: noUiSlider.Instance,
    spanCollection: NodeListOf<HTMLSpanElement>,
    isCount: boolean,
  ): noUiSlider.Instance {
    noUiSlider.create(<HTMLElement>uiSliderWrapper, {
      step,
      start: [min, max],
      connect: true,
      range: {
        min: isCount ? 1 : 1940,
        max: isCount ? 12 : 2020,
      },
    });

    uiSliderWrapper.noUiSlider.on('update', (value: Array<string>) => {
      this.uiSliderChangeHandler(value, uiSliderWrapper, spanCollection);
    });
    return uiSliderWrapper;
  }

  private uiSliderChangeHandler(
    value: Array<string>,
    uiSliderWrapper: noUiSlider.Instance,
    spanCollection: NodeListOf<HTMLSpanElement>,
  ) {
    const [valueOne, valueTwo] = value;
    if (uiSliderWrapper.dataset.option === 'count-range') {
      this.filterHandler('count-range', undefined, undefined, [
        +valueOne,
        +valueTwo,
      ]);
    } else {
      this.filterHandler('year-range', undefined, undefined, [
        +valueOne,
        +valueTwo,
      ]);
    }

    (<HTMLSpanElement>spanCollection[0]).innerText = Math.trunc(+valueOne).toString();
    (<HTMLSpanElement>spanCollection[1]).innerText = Math.trunc(+valueTwo).toString();
  }

  private updateFilterToys(
    type: string,
    criterion: string,
    value?: Array<number>,
  ): FilterObj {
    if (!value) {
      const currentProperty = (<FilterPropTypes> this.filterObj[criterion])[type];
      (<FilterPropTypes> this.filterObj[criterion])[type] = !currentProperty;
    } else {
      const minValue = value[0];
      const maxValue = value[1];
      (<FilterPropTypes> this.filterObj[criterion]).start = minValue;
      (<FilterPropTypes> this.filterObj[criterion]).end = maxValue;
    }
    return this.filterObj;
  }
}

export default ToysPage;
