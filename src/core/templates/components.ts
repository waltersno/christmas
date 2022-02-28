import Header from '../components/header/index.html';
import Footer from '../components/footer/index.html';
import ComponentNames from '../../utils/components-names';
import Utils from '../../utils/utils';

abstract class Components {
  protected container: HTMLElement;

  constructor(tagName: string) {
    let component: string;
    switch (tagName) {
      case ComponentNames.HEADER:
        component = Header;
        break;
      case ComponentNames.FOOTER:
        component = Footer;
        break;
      default:
        component = '<h2>Can not find component</h2>';
        break;
    }
    this.container = <HTMLElement>Utils.stringToHtml(component);
  }

  render(): HTMLElement {
    return this.container;
  }
}

export default Components;
