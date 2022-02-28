import PageNames from '../../utils/page-names';
import Utils from '../../utils/utils';
import mainPageHtml from '../../pages/main/index.html';
import toysPageHtml from '../../pages/toys/index.html';
import treePageHtml from '../../pages/сhristmas-tree/index.html';

abstract class Page {
  protected container: HTMLElement;

  constructor(pageName: string) {
    let page: string;
    switch (pageName) {
      case PageNames.HOME_PAGE:
        page = mainPageHtml;
        break;
      case PageNames.TOYS_PAGE:
        page = toysPageHtml;
        break;
      case PageNames.TREE_PAGE:
        page = treePageHtml;
        break;
      default:
        page = mainPageHtml;
        break;
    }
    this.container = <HTMLElement>Utils.stringToHtml(page);
  }

  render(): Node {
    return this.container;
  }
}

export default Page;
