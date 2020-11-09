import { LayerBlinkHandler } from './blink';
import { Layer } from '..';
import { EventEmitter } from 'events';

describe(LayerBlinkHandler.name, () => {
  it('should be able to construct', () => {
    expect(
      new LayerBlinkHandler(
        new Layer({
          layerSize: 42,
        }),
      ),
    ).toBeInstanceOf(LayerBlinkHandler);
  });

  describe('start()', () => {
    it('should run opacity.toggle in interval', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.start(10);
      expect(layer.opacity.visible).toBeCalledTimes(1);
      setTimeout(() => {
        expect(layer.opacity.toggle).toBeCalledTimes(1);
        handler.stop();
        done();
      }, 10);
    });
    it('should only run interval once', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      expect(handler.start(6)).toBeTruthy();
      expect(handler.start(6)).toBeFalsy();
      expect(layer.opacity.visible).toBeCalledTimes(1);
    });
  });

  describe('stop()', () => {
    it('interval should be canceled', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.start(6);
      setTimeout(() => {
        handler.stop();
        expect(layer.opacity.visible).toBeCalledTimes(1);
        done();
      }, 0);
    });

    it('should not try to cancel interval twice', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.start(6);
      setTimeout(() => {
        handler.stop();
        handler.stop();
        expect(layer.opacity.visible).toBeCalledTimes(1);
        done();
      }, 0);
    });
  });
  describe('toggle()', () => {
    it('should call start if interval is not running', () => {
      const layer = ({
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.start = jest.fn();
      handler.stop = jest.fn();
      handler.toggle();
      expect(handler.start).toBeCalledWith(1000);
      expect(handler.start).toBeCalledTimes(1);
    });

    it('should call stop if interval is already running', () => {
      const layer = ({
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.start = jest.fn();
      handler.stop = jest.fn();
      // @ts-ignore
      handler.interval = setInterval(() => {}, 0);
      handler.toggle();
      expect(handler.stop).toBeCalledTimes(1);
    });
  });

  describe('getState()', () => {
    it('should return true if handler is started', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.start(1000);
      expect(handler.getState()).toBeTruthy();
    });
    it('should return false if handler is stopped', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.start(1000);
      handler.onChanged(() => {
        expect(handler.getState()).toBeFalsy();
        done();
      });
      handler.stop();
    });
  });

  describe('onStarted()', () => {
    it('should trigger if state is true', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.onStarted(done);
      handler.start(1000);
    });
  });

  describe('onStopped()', () => {
    it('should trigger if state is false', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerBlinkHandler(layer);
      handler.onStopped(done);
      handler.onStarted(() => {
        handler.stop();
      });
      handler.start(1000);
    });
  });
});
