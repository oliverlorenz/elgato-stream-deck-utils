import { Button } from '../..';
import { readFileSync } from 'fs';
// @ts-ignore
import moment from 'moment';
import { Layer } from '../../../Layer';
import { ButtonInterface } from '../../interface';
import { ButtonEventDto } from '../../event/dto';

export class ProfileNextButton extends Button implements ButtonInterface {
  private menuImage: Buffer;
  private removeKeyUpHandler: Function;

  constructor(layerSize: number) {
    super(layerSize);
    this.menuImage = readFileSync('images/hamburger_icon.png');
    this.removeKeyUpHandler = () => {};
  }

  get backgroundLayer(): Layer {
    return this.layer(0);
  }

  switchProfile(dto: ButtonEventDto) {
    dto.profileManager.nextProfile();
  }

  activate() {
    super.activate();
    this.backgroundLayer.image.setImage(this.menuImage);
    this.removeKeyUpHandler = this.onKeyUp(this.switchProfile);
  }

  deactivate() {
    this.backgroundLayer.image.clearImage();
    this.removeKeyUpHandler();
    super.deactivate();
  }
}
