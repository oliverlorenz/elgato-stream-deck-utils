import { Layer } from '..';
import { LayerHandlerInterface } from './interface';
import { LayerOptions } from '../options';

export class LayerOpacityHandler implements LayerHandlerInterface<number> {
  private opacity: number;
  constructor(private layer: Layer) {
    this.opacity = 1;
  }

  visible(opacity = 1): void {
    this.setOpacity(opacity);
  }

  invisible() {
    this.setOpacity(0);
  }

  isInvisible() {
    return this.opacity === 0;
  }

  isVisible() {
    return !this.isInvisible();
  }

  toggle(): boolean {
    if (this.isVisible()) {
      this.setOpacity(0);
    } else {
      this.setOpacity(1);
    }
    return this.isVisible();
  }

  private setOpacity(opacity: number) {
    this.opacity = opacity;
    this.layer.emitter.emit('OPACITY_CHANGED', this.opacity);
  }

  onChanged(callback: (options: LayerOptions) => void) {
    this.layer.emitter.on('OPACITY_CHANGED', () => {
      callback({
        layerSize: this.layer.size,
        handlers: {
          opacity: this,
        },
      });
    });
  }

  getState() {
    return this.opacity;
  }
}
