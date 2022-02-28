export default class Setting {
  constructor(
    private bg: number,
    private tree: number,
    private sound: boolean,
    private snowflakes: boolean,
  ) {}

  public set setBgNum(num: number) {
    this.bg = num;
  }

  public set setTreeNum(num: number) {
    this.tree = num;
  }

  public set setSound(state: boolean) {
    this.sound = state;
  }

  public set setSnowFlakes(state: boolean) {
    this.snowflakes = state;
  }

  public get getBgNum(): number {
    return this.bg;
  }

  public get getTreeNum(): number {
    return this.tree;
  }

  public get getSoundState(): boolean {
    return this.sound;
  }

  public get getSnowState(): boolean {
    return this.snowflakes;
  }
}
