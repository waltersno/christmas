import Page from '../../core/templates/page';
import PageNames from '../../utils/page-names';
import Utils from '../../utils/utils';
import { ToysData } from '../../utils/utils-i';
import ToysPage from '../toys';
import Setting from './settings';
import './style.scss';

class TreePage extends Page {
  public toysPage: ToysPage;

  private toysData: ToysData[] | [] = [];

  private bgBtns: NodeListOf<HTMLButtonElement> | null = this.container.querySelectorAll('.bg-item');

  private snowflakesWrapper: HTMLDivElement | null = this.container.querySelector('.snowflakes-wrapper');

  private treeBtns: NodeListOf<HTMLButtonElement> | null = this.container.querySelectorAll('.tree-select-btn');

  private mainSide: HTMLDivElement | null = this.container.querySelector('.main-side');

  private treeImg: HTMLImageElement | null = this.container.querySelector('#tree');

  private snowToggle: HTMLButtonElement | null = this.container.querySelector('.snowflakes');

  private audioToggle: HTMLButtonElement | null = this.container.querySelector('.audio-toggle');

  private resetTreeBtn: HTMLButtonElement | null = this.container.querySelector('.reset-tree-btn');

  private garlandSwitcher: HTMLInputElement | null = this.container.querySelector('#garl-switch');

  private garlandWrapper: HTMLDivElement | null = this.container.querySelector('.garland-items');

  private toysListWrapper: HTMLDivElement | null = this.container.querySelector('.toys-list');

  private treeMap: HTMLMapElement | null = this.container.querySelector('#tree-map');

  private allListItems: NodeListOf<HTMLLIElement> | null = this.container.querySelectorAll('.toy-item');

  private radioColorBtns: NodeListOf<HTMLInputElement> | null = this.container.querySelectorAll('input[type="radio"][name="color"]');

  public audioPlayer: HTMLAudioElement | null = this.container.querySelector('#audio-player');

  public treeSettings: Setting = new Setting(1, 1, false, false);

  private toysToTree: Array<{order: number, count: number, num: number}> = [];

  constructor(toysPage: ToysPage) {
    super(PageNames.TREE_PAGE);
    this.toysPage = toysPage;
    this.addEventListeners();
    this.getFromLocalTreeSettings();
    this.setToysList();
  }

  private addEventListeners():void {
    this.addEventListenerToBgBtns();
    this.addEventListenerToTreeBtns();
    this.addEventListenersToSnowBtn();
    this.addEventListenersToAudioPlayer();
    this.addEventListenerToResetBtn();
    this.addEventListenerToGarland();
    this.addEventListenerToColorChange();
    this.addEventListenerToDropArea();
    this.addEventListenerToListDropArea();
  }

  private addEventListenerToListDropArea(): void {
    if (this.toysListWrapper) {
      this.toysListWrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      this.toysListWrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        const index = e.dataTransfer?.getData('number');
        if (index) {
          this.toysToTree = this.toysToTree.map((toy, idx) => {
            if (+index === idx) {
              return { ...toy, count: toy.count + 1 };
            }
            return toy;
          });
        }
        this.renderToysListByArray();
      });
    }
  }

  public async setToysList(): Promise<void> {
    this.toysData = await Utils.fetchToysData<ToysData[]>();
    this.toysToTree = [];
    const toysList = this.toysPage.yourChoosedArray;
    if (this.allListItems) {
      for (let index = 0; index < 20; index += 1) {
        const element = this.allListItems[index];
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        if (toysList.length) {
          if (toysList[index]) {
            const image = new Image();
            const span = document.createElement('span');
            image.src = `./assets/toys/${toysList[index]}.png`;
            const toyCount = this.toysData[toysList[index] - 1].count;
            span.textContent = toyCount;
            const imageNumber = +this.toysData[toysList[index] - 1].num - 1;
            element.append(image);
            element.append(span);
            this.dragListener(image, index);
            this.setToysToDress(index, +toyCount, imageNumber);
          }
        } else {
          const image = new Image();
          const span = document.createElement('span');
          image.src = `./assets/toys/${index + 1}.png`;
          const toyCount = this.toysData[index].count;
          span.textContent = toyCount;
          element.append(image);
          element.append(span);
          this.dragListener(image, index);
          this.setToysToDress(index, +toyCount, index);
        }
      }
    }
  }

  private setToysToDress(id: number, count: number, num: number): void {
    this.toysToTree.push({ order: id + 1, count, num: num + 1 });
  }

  private renderToysListByArray(): void {
    if (this.allListItems) {
      for (let index = 0; index < this.allListItems.length; index += 1) {
        const element = this.allListItems[index];
        const toyItem = this.toysToTree[index];
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        if (toyItem) {
          const image = new Image();
          const span = document.createElement('span');
          image.src = `./assets/toys/${toyItem.num}.png`;
          const toyCount = toyItem.count;
          if (toyCount >= 1) {
            span.textContent = toyCount.toString();
            element.append(image);
            element.append(span);
            this.dragListener(image, index);
          }
        }
      }
    }
  }

  private dragListener(image: HTMLImageElement, index: number): void {
    image.addEventListener('dragend', (e) => {
      if (e.dataTransfer?.dropEffect === 'copy') {
        const cloneImage = <HTMLImageElement>image.cloneNode(true);
        cloneImage.classList.add('toy-img');
        cloneImage.dataset.number = index.toString();
        cloneImage.addEventListener('dragstart', (event) => {
          event.dataTransfer?.setData('number', index.toString());
        });
        cloneImage.addEventListener('dragend', (event) => {
          if (event.dataTransfer?.dropEffect === 'copy') {
            if (this.mainSide) {
              if (event.pageX > 1000 || (event.pageY - this.mainSide.offsetTop) > 700) {
                cloneImage.remove();
              } else {
                cloneImage.style.position = 'absolute';
                cloneImage.style.top = `${event.pageY - 27}px`;
                cloneImage.style.left = `${event.pageX - 27}px`;
              }
            }
          } else {
            cloneImage.remove();
            this.toysToTree = this.toysToTree.map((toy) => {
              if (toy.order - 1 === index) {
                return { ...toy, count: toy.count + 1 };
              }
              return toy;
            });
            this.renderToysListByArray();
          }
        });
        document.body.append(cloneImage);
        cloneImage.style.position = 'absolute';
        cloneImage.style.top = `${e.pageY - 27}px`;
        cloneImage.style.left = `${e.pageX - 27}px`;
        this.toysToTree = this.toysToTree.map((toy) => {
          if (toy.order - 1 === index) {
            return { ...toy, count: toy.count - 1 };
          }
          return toy;
        });
        this.renderToysListByArray();
      }
    });
  }

  private addEventListenerToDropArea(): void {
    if (this.treeMap) {
      this.treeMap.addEventListener('dragover', (event) => {
        event.preventDefault();
      });
      this.treeMap.addEventListener('drop', (e) => {
        e.preventDefault();
      });
    }
  }

  private addEventListenerToColorChange(): void {
    if (this.radioColorBtns) {
      for (let index = 0; index < this.radioColorBtns.length; index += 1) {
        const element = this.radioColorBtns[index];
        element.addEventListener('change', () => {
          const classN = element.value;
          if (this.garlandWrapper) {
            this.garlandWrapper.className = `garland-items ${classN}`;
          }
        });
      }
    }
  }

  private addEventListenerToGarland(): void {
    if (this.garlandSwitcher) {
      this.garlandSwitcher.addEventListener('input', () => {
        const isTurnedOn = this.garlandSwitcher?.checked;
        if (isTurnedOn) {
          this.addGarlandToTree();
        } else {
          while (this.garlandWrapper?.firstChild) {
            this.garlandWrapper.removeChild(this.garlandWrapper.firstChild);
          }
        }
      });
    }
  }

  private addGarlandToTree(): void {
    if (this.garlandWrapper) {
      let garlandCount = 5;
      let top = -450;
      let deg = 80;
      for (let index1 = 0; index1 < 6; index1 += 1) {
        const ul = document.createElement('ul');
        ul.classList.add('garland-one-line');
        ul.style.top = `${top}px`;
        for (let index2 = 0; index2 < garlandCount; index2 += 1) {
          const li = document.createElement('li');
          li.style.transform = `rotate(${deg + (index2 * 6)}deg) translate(250px) rotate(-${deg + (index2 * 6)}deg)`;
          ul.append(li);
        }
        this.garlandWrapper.append(ul);
        garlandCount += 2;
        top += 100;
        deg -= 6;
      }
    }
  }

  private addEventListenerToResetBtn(): void {
    if (this.resetTreeBtn) {
      this.resetTreeBtn.addEventListener('click', () => {
        this.resetSettingObj();
        localStorage.removeItem('walter-tree-setting');
      });
    }
  }

  private resetSettingObj(): void {
    this.treeSettings.setBgNum = 1;
    this.treeSettings.setTreeNum = 1;
    this.treeSettings.setSound = false;
    this.treeSettings.setSnowFlakes = false;
  }

  private getFromLocalTreeSettings(): void {
    const data = Utils.getFromLocalStorageTreeSetting();
    if (data) {
      this.treeSettings.setSound = data.sound;
      this.treeSettings.setSnowFlakes = data.snowflakes;
      this.treeSettings.setBgNum = data.bg;
      this.treeSettings.setTreeNum = data.tree;
      this.setSavedSettings();
    }
  }

  private setSavedSettings(): void {
    if (this.treeSettings.getSoundState) {
      if (this.audioPlayer) {
        const clickHandle = () => {
          this.audioPlayer?.play();
          window.removeEventListener('click', clickHandle);
        };
        window.addEventListener('click', clickHandle);
        this.audioToggle?.classList.add('active');
      }
    }
    if (this.treeSettings.getSnowState) {
      this.snowflakesWrapper?.classList.add('active');
      this.snowToggle?.classList.add('active');
    }
    if (this.treeImg) {
      this.treeImg.src = `./assets/${this.treeSettings.getTreeNum}tree.png`;
    }
    if (this.mainSide) {
      this.mainSide.style.background = `center/cover no-repeat url('./assets/${this.treeSettings.getBgNum}.jpg')`;
    }
  }

  private addEventListenerToBgBtns(): void {
    if (this.bgBtns) {
      for (let index = 0; index < this.bgBtns.length; index += 1) {
        const btn = this.bgBtns[index];
        btn.addEventListener('click', () => {
          this.bgChangeHandler(btn);
        });
      }
    }
  }

  private addEventListenerToTreeBtns(): void {
    if (this.treeBtns) {
      for (let index = 0; index < this.treeBtns.length; index += 1) {
        const btn = this.treeBtns[index];
        btn.addEventListener('click', () => {
          this.treeChangeHandler(btn);
        });
      }
    }
  }

  private bgChangeHandler(btn: HTMLButtonElement): void {
    const imgNum = btn.dataset.bg;
    if (this.mainSide && imgNum) {
      this.treeSettings.setBgNum = +imgNum;
      this.mainSide.style.background = `center/cover no-repeat url('./assets/${imgNum}.jpg')`;
    }
  }

  private treeChangeHandler(btn: HTMLButtonElement): void {
    const imgNum = btn.dataset.tree;
    if (this.treeImg && imgNum) {
      this.treeSettings.setTreeNum = +imgNum;
      this.treeImg.src = `./assets/${imgNum}tree.png`;
    }
  }

  private addEventListenersToSnowBtn(): void {
    if (this.snowToggle) {
      this.snowToggle.addEventListener('click', () => {
        this.snowToggleHandler();
      });
    }
  }

  private snowToggleHandler(): void {
    if (this.snowflakesWrapper) {
      if (this.snowflakesWrapper.classList.contains('active')) {
        this.snowflakesWrapper.classList.remove('active');
        this.snowToggle?.classList.remove('active');
        this.treeSettings.setSnowFlakes = false;
      } else {
        this.snowflakesWrapper.classList.add('active');
        this.snowToggle?.classList.add('active');
        this.treeSettings.setSnowFlakes = true;
      }
    }
  }

  private addEventListenersToAudioPlayer(): void {
    if (this.audioToggle) {
      this.audioToggle.addEventListener('click', () => {
        this.audioToggleHandler();
      });
    }
  }

  private audioToggleHandler(): void {
    if (this.audioPlayer) {
      if (this.audioPlayer.paused) {
        this.audioPlayer.play();
        this.audioToggle?.classList.add('active');
        this.treeSettings.setSound = true;
      } else {
        this.audioPlayer.pause();
        this.audioToggle?.classList.remove('active');
        this.treeSettings.setSound = false;
      }
    }
  }
}

export default TreePage;
