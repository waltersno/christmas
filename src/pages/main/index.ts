import './style.scss';
import Page from '../../core/templates/page';
import PageNames from '../../utils/page-names';

class MainPage extends Page {
  constructor() {
    super(PageNames.HOME_PAGE);
  }
}

export default MainPage;
