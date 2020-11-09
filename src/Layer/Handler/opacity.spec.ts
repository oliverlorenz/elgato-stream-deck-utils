import { Layer } from '..';
import { LayerOpacityHandler } from './opacity';
import { EventEmitter } from 'events';

describe(LayerOpacityHandler.name, () => {
  it('should be able to construct', () => {
    expect(
      new LayerOpacityHandler(
        new Layer({
          layerSize: 42,
        }),
      ),
    ).toBeInstanceOf(LayerOpacityHandler);
  });

  describe('onChanged()', () => {
    it('should call callback', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerOpacityHandler(layer);
      handler.onChanged(() => {
        done();
      });
      layer.emitter.emit('OPACITY_CHANGED');
    });
  });

  describe('visible()', () => {
    it('switch state to 1', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerOpacityHandler(layer);
      handler.visible();
      expect(handler.getState()).toEqual(1);
    });
  });

  describe('isVisible()', () => {
    it('is true', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerOpacityHandler(layer);
      handler.visible();
      expect(handler.isVisible()).toBeTruthy();
    });
  });

  describe('invisible()', () => {
    it('switch state to 0', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerOpacityHandler(layer);
      handler.invisible();
      expect(handler.getState()).toEqual(0);
    });
  });

  describe('isInvisible()', () => {
    it('is true', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerOpacityHandler(layer);
      handler.invisible();
      expect(handler.isInvisible()).toBeTruthy();
    });
  });

  describe('toggle()', () => {
    it('should switch state', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerOpacityHandler(layer);
      expect(handler.toggle()).toBeFalsy();
      expect(handler.toggle()).toBeTruthy();
    });
  });
});
