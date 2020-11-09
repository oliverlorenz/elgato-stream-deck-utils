import { Layer } from '.';
import { EventEmitter } from 'events';
import { LayerBlinkHandler } from './Handler/blink';

describe(Layer.name, () => {
  it('should be able to construct', () => {
    expect(
      new Layer({
        layerSize: 42,
      }),
    ).toBeInstanceOf(Layer);
  });

  it('should be able to construct without EventEmitter', () => {
    expect(
      new Layer({
        layerSize: 42,
      }),
    ).toBeInstanceOf(Layer);
  });

  describe('onChanged()', () => {
    it('should call callback if "CHANGED" event emitted', () => {
      const emitter = new EventEmitter();
      const layer = new Layer({
        layerSize: 42,
        emitter,
      });
      const callback = jest.fn();

      layer.onChanged(callback);
      emitter.emit('CHANGED');
      expect(callback).toBeCalledTimes(1);
    });
  });

  describe('emitChangedEvent()', () => {
    it('handler should trigger', () => {
      const emitter = new EventEmitter();
      const layer = new Layer({
        layerSize: 42,
        emitter,
        handlers: {
          blinking: {
            onChanged: callback => {
              emitter.on('trigger', callback);
            },
          } as LayerBlinkHandler,
        },
      });
      const callback = jest.fn();

      layer.onChanged(callback);
      emitter.emit('trigger');
      expect(callback).toBeCalledTimes(1);
    });
  });
});
