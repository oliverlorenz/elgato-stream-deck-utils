// @ts-ignore
import requestPromiseNative from 'request-promise-native';

export class ImageHandler {
  async getRandomImage(xIconSize: number) {
    return this.getImageFromWeb(`https://picsum.photos/${xIconSize}`);
  }

  async getImageFromWeb(url: string) {
    return await requestPromiseNative(url, {
      encoding: null,
    });
  }
}
