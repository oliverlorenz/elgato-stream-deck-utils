import { EventEmitter } from 'events';
import sharp = require('sharp');
import { ButtonEventInternal } from './event/internal';
import { Layer } from '../Layer';
import { ButtonInterface } from './interface';
import { ButtonEventDto } from './event/dto';

export interface IImage {
  sharpInstance: sharp.Sharp | null;
  visible: boolean;
}

enum Event {
  RENDER = 'RENDER',
}

export class Button implements ButtonInterface {
  protected layers: Map<number, Layer>;
  protected emitter: EventEmitter;
  private renderOnLayerChangeState: boolean;
  protected keyUpToggleState: boolean = true;

  constructor(private layerSize: number) {
    this.emitter = new EventEmitter();
    this.emitter.on(ButtonEventInternal.RENDER, this.render);

    this.layers = new Map<number, Layer>();
    this.renderOnLayerChangeState = true;
  }

  emitKeyUp(dto: ButtonEventDto) {
    this.emitter.emit(ButtonEventInternal.INTERNAL_KEY_UP, dto);
  }

  emitKeyDown(dto: ButtonEventDto) {
    this.emitter.emit(ButtonEventInternal.INTERNAL_KEY_DOWN, dto);
  }

  public layer(layerIndex: number): Layer {
    if (!this.layers.has(layerIndex)) {
      const newLayer = new Layer({ layerSize: this.layerSize });
      this.layers.set(layerIndex, newLayer);
      newLayer.onChanged(() => {
        if (this.renderOnLayerChangeState) {
          this.render();
        }
      });
    }
    return this.layers.get(layerIndex) as Layer;
  }

  public renderOnLayerChange(state: boolean = true): Button {
    this.renderOnLayerChangeState = state;
    return this;
  }

  private async render() {
    const baseImage = sharp({
      create: {
        width: this.layerSize,
        height: this.layerSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const compositeList: sharp.OverlayOptions[] = [];
    for (const [, layer] of this.layers) {
      if (layer.image.hasImageData() && layer.opacity.isVisible()) {
        compositeList.push({
          input: await layer.image.getImageData()?.toBuffer(),
          gravity: 'centre',
        });
      }
    }

    const composedImage = await baseImage
      .composite(compositeList)
      .removeAlpha()
      .flatten()
      .toBuffer();

    // this.streamDeck.fillImage(this.buttonIndex, composedImage);
    this.emitRender(composedImage);
  }

  private emitRender(composedImage: Buffer) {
    this.emitter.emit(Event.RENDER, composedImage);
  }

  public onKeyDown(callback: (dto: ButtonEventDto) => void) {
    const event = ButtonEventInternal.INTERNAL_KEY_DOWN.toString();
    this.emitter.on(event, callback);
    return () => {
      this.emitter.removeListener(event, callback);
    };
  }

  public onceKeyDown(callback: (buttce: Button) => void) {
    this.emitter.once(ButtonEventInternal.INTERNAL_KEY_DOWN.toString(), () => {
      callback(this);
    });
  }

  public onKeyUp(callback: (dto: ButtonEventDto) => void): () => void {
    const event = ButtonEventInternal.INTERNAL_KEY_UP.toString();
    this.emitter.on(event, callback);
    return () => {
      this.emitter.removeListener(event, callback);
    };
  }

  public onKeyUpToggle(startCallback: () => void, stopCallback: () => void): () => void {
    return this.onKeyUp(() => {
      if (this.keyUpToggleState) {
        startCallback();
      } else {
        stopCallback();
      }
      this.keyUpToggleState = !this.keyUpToggleState;
    });
  }

  onRender(handler: (composedImage: Buffer) => void) {
    this.emitter.on(Event.RENDER, composedImage => {
      handler(composedImage);
    });
  }

  public onceKeyUp(callback: (dto: ButtonEventDto) => void) {
    this.emitter.once(ButtonEventInternal.INTERNAL_KEY_UP.toString(), (dto: ButtonEventDto) => {
      callback(dto);
    });
  }

  activate() {
    this.keyUpToggleState = true;
    this.render();
  }

  deactivate(): void {
    this.layers.clear();
    this.render();
  }
}
