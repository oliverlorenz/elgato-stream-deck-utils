import { EventEmitter } from 'events';
import sharp = require('sharp');
import { ImageHandler } from '../ImageHandler';
import { ButtonEventInternal } from './event/internal';
import { StreamDeck } from 'elgato-stream-deck';

export interface IImage {
  sharpInstance: sharp.Sharp;
  visible: boolean;
}

export class Button {

  protected imageLayers: Map<number, IImage>;
  protected emitter: EventEmitter;

  constructor(
    protected streamDeck: StreamDeck,
    readonly buttonIndex: number,
  ) {
    this.emitter = new EventEmitter();
    this.emitter.on(ButtonEventInternal.RENDER, this.render.bind(this));

    this.imageLayers = new Map<number, IImage>();
  }

  public async render() {
    const baseImage = sharp({
      create: {
        width: this.streamDeck.ICON_SIZE,
        height: this.streamDeck.ICON_SIZE,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const compositeList: sharp.OverlayOptions[] = [];

    for (const index of this.imageLayers.keys()) {
      const image = this.imageLayers.get(index);
      if (image && image.visible) {
        compositeList.push({
          input: await image.sharpInstance.toBuffer(),
          gravity: 'centre',
        });
      }
    }

    const composedImage = await baseImage.composite(compositeList)
      .removeAlpha()
      .flatten()
      .toBuffer();

    this.streamDeck.fillImage(
       this.buttonIndex,
       composedImage,
    );
  }

  public async setImageFromWeb(
    imageLayerIndex: number,
    url: string,
  ) {
    const rawImageBuffer = await ImageHandler.getImageFromWeb(url);
    return this.setImage(imageLayerIndex, rawImageBuffer);
  }

  public async clearImage(
    imageLayerIndex: number
  ) {
    this.imageLayers.delete(imageLayerIndex);
    return Promise.resolve();
  }

  public async setImage(
    imageLayerIndex: number,
    content: sharp.SharpOptions | undefined | String | Buffer,
    visible: boolean = true,
  ) {
    this.imageLayers.set(
      imageLayerIndex,
      {
        visible,
        sharpInstance: sharp(content as sharp.SharpOptions | undefined)
          .resize(this.streamDeck.ICON_SIZE, this.streamDeck.ICON_SIZE),
      },
    );
    return Promise.resolve();
  }

  public async setColor(
    displayLevel: number,
    r: number,
    g: number,
    b: number,
    alpha: number = 1,
  ) {
    this.setImage(
      displayLevel,
      Buffer.from(
        `<svg viewBox="0 0 ${this.streamDeck.ICON_SIZE} ${this.streamDeck.ICON_SIZE}">
          <rect width="100%" height="100%" fill="rgb(${r},${g},${b},${alpha})"/>
        </svg>`,
      ),
      alpha !== 0,
    );
  }

  public setLayerVisibility(imageLayerIndex: number, visible: boolean) {
    const layerContent = this.imageLayers.get(imageLayerIndex);
    if (!layerContent) return;
    layerContent.visible = visible;
    this.imageLayers.set(imageLayerIndex, layerContent);
  }

  public toggleLayerVisibility(imageLayerIndex: number) {
    const layerContent = this.imageLayers.get(imageLayerIndex);
    if (!layerContent) return Promise.resolve();

    layerContent.visible = !layerContent.visible;
    this.imageLayers.set(imageLayerIndex, layerContent);
    return Promise.resolve();
  }

  public blink(
    imageLayerIndex: number,
    time: number,
  ): number {
    return setInterval(
      async () => {
        await this.toggleLayerVisibility(imageLayerIndex);
        this.render();
      },
      time,
    ) as unknown as number;
  }

  public onKeyDown(callback: (button: Button) => void) {
    this.emitter.on(
      ButtonEventInternal.INTERNAL_KEY_DOWN.toString(),
      () => {
        callback(this);
      },
    );
  }

  public onceKeyDown(callback: (buttce: Button) => void) {
    this.emitter.once(
      ButtonEventInternal.INTERNAL_KEY_DOWN.toString(),
      () => {
        callback(this);
      },
    );
  }

  public onKeyUp(callback: (button: Button) => void) {
    const event = ButtonEventInternal.INTERNAL_KEY_UP.toString();
    function handler() {
      // @ts-ignore
      callback(this);
    }
    this.emitter.on(
      event,
      handler.bind(this),
    );
    return () => {
      this.emitter.removeListener(event, handler);
    };
  }

  public onceKeyUp(callback: (button: Button) => void) {
    this.emitter.once(
      ButtonEventInternal.INTERNAL_KEY_UP.toString(),
      () => {
        callback(this);
      },
    );
  }

  public async setText(
    imageLayerIndex: number,
    text: string,
  ) {
    return this.setImage(
      imageLayerIndex,
      Buffer.from(
        `<svg width="${this.streamDeck.ICON_SIZE}" height="${this.streamDeck.ICON_SIZE}">
           <text x="50%" y="50%" font-size="30" dominant-baseline="middle" text-anchor="middle">${text}</text>
         </svg>`,
      ),
    );
  }

  public pulseColor(
    imageLayerIndex: 0,
    r: number,
    g: number,
    b: number,
    ms: number,
    render: boolean = true,
  ) {
    let counter: number = 0;
    setInterval(
      async () => {
        counter = counter + 0.1;
        await this.setColor(
          imageLayerIndex,
          Math.sin(counter) * (r / 2) + (r / 2),
          Math.sin(counter) * (g / 2) + (g / 2),
          Math.sin(counter) * (b / 2) + (b / 2),
        );
        if (render) {
          this.render();
        }
      },
      ms,
    );
  }
}
