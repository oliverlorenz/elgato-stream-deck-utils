import { ButtonInterface } from '../Button/interface';
import { StreamDeck } from 'elgato-stream-deck';

export class Profile {
  private buttonMap = new Map<number, ButtonInterface>();
  constructor(private streamDeck: StreamDeck) {}

  public getButtonByIndex(index: number): ButtonInterface {
    if (!this.buttonMap.has(index)) {
      throw new Error('No Button set');
    }
    return this.buttonMap.get(index) as ButtonInterface;
  }

  public hasButtonByIndex(index: number): boolean {
    return this.buttonMap.has(index);
  }

  // public getIndexBelow(index: number): number {
  //   return index + this.profileManager. streamDeck.KEY_COLUMNS;
  // }

  // public getIndexAbove(index: number): number {
  //   const calculatedIndex = index - this.profileManager.streamDeck.KEY_COLUMNS;
  //   if (calculatedIndex < 0) {
  //     throw new Error('not possible');
  //   }
  //   return calculatedIndex;
  // }

  // public getIndexRight(index: number): number {
  //   const calculatedIndex = index + 1;
  //   if (calculatedIndex > this.profileManager.streamDeck.NUM_KEYS - 1) {
  //     throw new Error('not possible');
  //   }
  //   return calculatedIndex;
  // }

  // public getIndexLeft(index: number): number {
  //   const calculatedIndex = index - 1;
  //   if (calculatedIndex < 0) {
  //     throw new Error('not possible');
  //   }
  //   return calculatedIndex;
  // }

  public async activate(): Promise<Profile> {
    for (const [, button] of this.buttonMap) {
      button.activate();
    }
    return this;
  }

  public deactivate() {
    for (const [, button] of this.buttonMap) {
      button.deactivate();
    }
    return this;
  }

  public addButton(buttonIndex: number, buttonInterface: ButtonInterface): ButtonInterface {
    if (this.hasButtonByIndex(buttonIndex)) {
      this.getButtonByIndex(buttonIndex).deactivate();
    }
    if (!this.buttonMap.has(buttonIndex)) {
      this.buttonMap.set(buttonIndex, buttonInterface);
    }
    buttonInterface.onRender(composedImage => {
      this.streamDeck.fillImage(buttonIndex, composedImage);
    });
    return buttonInterface;
  }
}
