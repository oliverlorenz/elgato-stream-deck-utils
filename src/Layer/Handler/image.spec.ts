import { Layer } from '..';
import { LayerImageHandler } from './image';
import { EventEmitter } from 'events';
import { ImageHandler } from '../../ImageHandler';

describe(LayerImageHandler.name, () => {
  it('should be able to construct', () => {
    expect(
      new LayerImageHandler(
        new Layer({
          layerSize: 42,
        }),
      ),
    ).toBeInstanceOf(LayerImageHandler);
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
      const handler = new LayerImageHandler(layer);
      handler.onChanged(() => {
        done();
      });
      layer.emitter.emit('IMAGE_CHANGED');
    });
  });

  describe('setImage()', () => {
    it('should call callback', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerImageHandler(layer);
      handler.onChanged(() => {
        done();
      });
      handler.setImage(Buffer.from(''));
    });
  });

  describe('setColor()', () => {
    it('should call setImage', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerImageHandler(layer);
      handler.setImage = jest.fn();
      handler.setColor(255, 255, 255, 1);
      expect(handler.setImage).toBeCalledTimes(1);
    });
  });

  describe('setText()', () => {
    it('should call setImage', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerImageHandler(layer);
      handler.setImage = jest.fn();
      handler.setText('text');
      expect(handler.setImage).toBeCalledTimes(1);
    });
  });

  describe('clearImage()', () => {
    it('should call setImage', done => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerImageHandler(layer);
      handler.setImage = jest.fn();
      handler.setText('text');
      handler.onChanged(() => done());
      handler.clearImage();
    });
  });

  describe('hasImageData()', () => {
    it('should return true if imagedata is set', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerImageHandler(layer);
      handler.setText('text');
      expect(handler.hasImageData()).toBeTruthy();
    });
  });

  describe('getImageData()', () => {
    it('should return data', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerImageHandler(layer);
      handler.setText('text');
      expect(handler.getImageData()).toBeDefined();
    });
  });

  describe('getState()', () => {
    it('should return data', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerImageHandler(layer);
      handler.setText('text');
      expect(handler.getState()).toBeTruthy();
    });

    it('should return data', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const handler = new LayerImageHandler(layer);
      expect(handler.getState()).toBeFalsy();
    });
  });

  describe('setImageFromWeb()', () => {
    it('should return data', () => {
      const layer = ({
        opacity: {
          toggle: jest.fn(),
          visible: jest.fn(),
          invisible: jest.fn(),
        },
        emitter: new EventEmitter(),
      } as unknown) as Layer;
      const imageHandler = {
        getImageFromWeb: jest.fn().mockReturnValue(Buffer.from('')),
        getRandomImage: jest.fn(),
      } as ImageHandler;
      const handler = new LayerImageHandler(layer, imageHandler);
      expect(handler.setImageFromWeb('')).toBeTruthy();
    });
  });
});
