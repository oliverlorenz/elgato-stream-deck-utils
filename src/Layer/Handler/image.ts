import { Layer } from '..';
import { LayerHandlerInterface } from './interface';
// @ts-ignore
import sharp from 'sharp';
import { ImageHandler } from '../../ImageHandler';
import { LayerOptions } from '../options';

export interface TextOptions {
  color?: string;
  size?: number;
  posX?: string;
  posY?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?: 'central' | 'middle' | 'text-top';
}

export class LayerImageHandler implements LayerHandlerInterface<sharp.Sharp | undefined> {
  private image: sharp.Sharp | undefined;
  constructor(private layer: Layer, private imageHandler = new ImageHandler()) {}

  onChanged(callback: (options: LayerOptions) => void) {
    this.layer.emitter.on('IMAGE_CHANGED', () => {
      callback({
        layerSize: this.layer.size,
        handlers: {
          image: this,
        },
      });
    });
  }

  setImage(content: sharp.SharpOptions | Buffer) {
    this.image = sharp(content as sharp.SharpOptions).resize(this.layer.size, this.layer.size);
    this.layer.emitter.emit('IMAGE_CHANGED');
  }

  setColor(r: number, g: number, b: number, /* istanbul ignore next */ alpha: number = 1) {
    this.setImage(
      Buffer.from(
        `<svg viewBox="0 0 ${this.layer.size} ${this.layer.size}">
          <rect width="100%" height="100%" fill="rgb(${r},${g},${b},${alpha})"/>
        </svg>`,
      ),
    );
  }

  setText(text: string, options?: TextOptions) {
    /* istanbul ignore next */
    return this.setImage(
      Buffer.from(
        `<svg width="${this.layer.size}" height="${this.layer.size}">
           <text text-anchor="${options?.textAnchor ? options.textAnchor : 'middle'}" x="${
          options?.posX ? options.posX : '50%'
        }" y="${options?.posY ? options.posY : '50%'}" ${
          options?.size ? 'font-size="' + options.size + '"' : ''
        } ${options?.color ? 'fill="' + options.color + '"' : ''} dominant-baseline="${
          options?.dominantBaseline ? options.dominantBaseline : 'middle'
        }" text-anchor="middle">${text}</text>
         </svg>`,
      ),
    );
  }

  clearImage() {
    delete this.image;
    this.layer.emitter.emit('IMAGE_CHANGED');
  }

  hasImageData() {
    return !!this.image;
  }

  getImageData(): sharp.Sharp | undefined {
    return this.image;
  }

  async setImageFromWeb(url: string) {
    const rawImageBuffer = await this.imageHandler.getImageFromWeb(url);
    return this.setImage(rawImageBuffer);
  }

  getState() {
    return this.image;
  }
}
