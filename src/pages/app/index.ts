import Footer from '../../core/components/footer';
import Header from '../../core/components/header';
import PageNames from '../../utils/page-names';
import Utils from '../../utils/utils';
import MainPage from '../main';
import ToysPage from '../toys';
import TreePage from '../сhristmas-tree';

class App {
  private mainNode: HTMLElement = <HTMLElement>document.querySelector('#main');

  private initialPage: MainPage = new MainPage();

  private header: Header = new Header();

  private footer: Footer = new Footer();

  private toysPage: ToysPage = new ToysPage();

  private treePage: TreePage = new TreePage(this.toysPage);

  constructor() {
    document.body.insertBefore(this.header.render(), document.body.firstChild);
    this.toysPage.setChoosedCountInHeader();
    document.body.appendChild(this.footer.render());
  }

  run(): void {
    this.renderNewPage('toys-page');
    this.enableRouteChange();
    this.renderUiSliderByStart();
    this.addEventBeforeUnload();
  }

  private addEventBeforeUnload(): void {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      localStorage.setItem('walter-filters', JSON.stringify(this.toysPage.filterObj));
      localStorage.setItem(
        'walter-choosed',
        JSON.stringify(this.toysPage.yourChoosedArray),
      );
      localStorage.setItem('walter-tree-setting', JSON.stringify(this.treePage.treeSettings));
    });
  }

  private renderUiSliderByStart(): void {
    const data = Utils.getFromLocalStorageFilterObj();
    if (data) {
      const {
        count: { start: startCount },
        count: { end: endCount },
        year: { start: startYear },
        year: { end: endYear },
      } = data;
      this.toysPage.renderTwoUiSlider(startCount, endCount, startYear, endYear);
    } else {
      this.toysPage.renderTwoUiSlider(1, 12, 1940, 2020);
    }
  }

  private renderNewPage(hash: string): void {
    while (this.mainNode.firstChild) {
      this.mainNode.removeChild(this.mainNode.firstChild);
    }

    if (hash === PageNames.TOYS_PAGE) {
      this.mainNode.append(this.toysPage.render());
      this.toysPage.focusOnSearch();
    } else if (hash === PageNames.TREE_PAGE) {
      this.mainNode.append(this.treePage.render());
      this.treePage.setToysList();
    } else {
      this.mainNode.append(this.initialPage.render());
    }
  }

  private enableRouteChange(): void {
    const oldHash: string = window.location.hash.slice(1);
    this.renderNewPage(oldHash);
    this.header.addStyleToActiveLink(oldHash);
    window.addEventListener('hashchange', () => {
      this.removeToys();
      const hash = window.location.hash.slice(1);
      if (hash === PageNames.TREE_PAGE && this.treePage.treeSettings.getSoundState) {
        this.treePage.audioPlayer?.play();
      }
      this.renderNewPage(hash);
      this.header.addStyleToActiveLink(hash);
    });
  }

  private removeToys(): void {
    const treeToys = document.querySelectorAll('.toy-img');
    if (treeToys) {
      for (let index = 0; index < treeToys.length; index += 1) {
        const element = treeToys[index];
        element.remove();
      }
    }
  }
}

export default App;
