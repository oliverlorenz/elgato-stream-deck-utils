import { EventEmitter } from 'events';
import { LayerBlinkHandler } from './Handler/blink';
import { LayerOpacityHandler } from './Handler/opacity';
import { LayerImageHandler } from './Handler/image';

export interface LayerOptions {
  layerSize: number;
  emitter?: EventEmitter;
  handlers?: {
    blinking?: LayerBlinkHandler;
    opacity?: LayerOpacityHandler;
    image?: LayerImageHandler;
  };
}
