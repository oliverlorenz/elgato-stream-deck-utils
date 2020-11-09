import { Device as UsbDevice } from 'usb';
// @ts-ignore
import usb from 'usb';

import { openStreamDeck, StreamDeck } from 'elgato-stream-deck';

export class Device {
  async waitForConnect(callback: (streamDeck: StreamDeck) => void) {
    usb.on('attach', (device: UsbDevice) => {
      if (this.isStreamDeck(device)) {
        callback(openStreamDeck());
      }
    });
    usb.getDeviceList().filter((device: UsbDevice) => {
      if (this.isStreamDeck(device)) {
        callback(openStreamDeck());
      }
    });
  }

  private isStreamDeck(device: UsbDevice) {
    return device.deviceDescriptor.idVendor === 0x0fd9;
  }
}
