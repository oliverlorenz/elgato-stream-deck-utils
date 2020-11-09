import { Layer } from '..';
import { LayerHandlerInterface } from './interface';
import { LayerOptions } from '../options';

export class LayerBlinkHandler implements LayerHandlerInterface<boolean> {
  private interval: NodeJS.Timeout | undefined;
  private state: boolean;

  constructor(private layer: Layer) {
    this.state = false;
  }

  start(milliseconds: number): boolean {
    if (this.interval) return false;
    this.interval = setInterval(this.layer.opacity.toggle, milliseconds);
    this.layer.opacity.visible();
    this.setState(true);
    return true;
  }

  onStarted(callback: () => void) {
    this.onChanged(options => {
      /* istanbul ignore else */
      if (this.getState()) callback();
    });
  }

  stop() {
    if (!this.interval) return;

    clearInterval(this.interval);
    delete this.interval;
    this.layer.opacity.invisible();
    this.setState(false);
  }

  onStopped(callback: () => void) {
    this.onChanged(options => {
      if (!this.getState()) callback();
    });
  }

  toggle(milliseconds: number = 1000) {
    if (!this.interval) {
      return this.start(milliseconds);
    }
    return this.stop();
  }

  private setState(state: boolean) {
    this.state = state;
    this.layer.emitter.emit('BLINKING_CHANGED', this.state);
  }

  getState() {
    return this.state;
  }

  onChanged(callback: (options: LayerOptions) => void) {
    this.layer.emitter.on('BLINKING_CHANGED', (state: boolean) => {
      callback({
        layerSize: this.layer.size,
        handlers: {
          blinking: this,
        },
      });
    });
  }
}
