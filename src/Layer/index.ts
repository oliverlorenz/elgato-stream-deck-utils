import { EventEmitter } from 'events';
import { LayerBlinkHandler } from './Handler/blink';
import { LayerOpacityHandler } from './Handler/opacity';
import { LayerImageHandler } from './Handler/image';
import { LayerOptions } from './options';

enum Event {
  VISIBILITY_CHANGED = 'VISIBILITY_CHANGED',
  BLINKING = 'VISIBILITY_CHANGED',
  IMAGE_CHANGED = 'IMAGE_CHANGED',
  CHANGED = 'CHANGED',
}

export class Layer {
  readonly blinking: LayerBlinkHandler;
  readonly opacity: LayerOpacityHandler;
  readonly image: LayerImageHandler;
  readonly emitter: EventEmitter;
  readonly size: number;

  constructor(options: LayerOptions) {
    this.emitter = options.emitter || new EventEmitter();
    this.size = options.layerSize;
    this.blinking = options.handlers?.blinking || new LayerBlinkHandler(this);
    this.opacity = options.handlers?.opacity || new LayerOpacityHandler(this);
    this.image = options.handlers?.image || new LayerImageHandler(this);
    this.blinking.onChanged(() => this.emitChangedEvent());
    this.opacity.onChanged(() => this.emitChangedEvent());
    this.image.onChanged(() => this.emitChangedEvent());
  }

  private emitChangedEvent() {
    this.emitter.emit(Event.CHANGED, this);
  }

  // pulseColor(r: number, g: number, b: number, ms: number) {
  //   let counter: number = 0;
  //   setInterval(async () => {
  //     counter = counter + 0.1;
  //     await this.setColor(
  //       Math.sin(counter) * (r / 2) + r / 2,
  //       Math.sin(counter) * (g / 2) + g / 2,
  //       Math.sin(counter) * (b / 2) + b / 2
  //     );
  //   }, ms);
  // }

  onChanged(callback: (layer: Layer) => void): void {
    this.emitter.on(Event.CHANGED, callback);
  }
}
