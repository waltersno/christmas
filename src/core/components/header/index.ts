import Components from '../../templates/components';
import './style.scss';

class Header extends Components {
  private headerLinks: NodeListOf<Element>;

  constructor() {
    super('header');
    this.headerLinks = this.container.querySelectorAll('.header__link');
  }

  public addStyleToActiveLink(hash: string): void {
    this.headerLinks.forEach((link) => {
      const linkHrefUll = (<HTMLLinkElement>link).href;
      const linkHrefHash = linkHrefUll.substring(linkHrefUll.indexOf('#') + 1);
      if (link.id !== 'home-link') {
        if (hash === linkHrefHash) {
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      } else {
        if (hash === linkHrefHash || !hash) {
          link.classList.add('active-home');
        } else {
          link.classList.remove('active-home');
        }
      }
    });
  }
}

export default Header;
