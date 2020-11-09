import * as sharp from 'sharp';
import { LayerOptions } from '../options';

export interface LayerHandlerInterface<T> {
  onChanged(callback: (options: LayerOptions) => void): void;
  getState(): T;
}
