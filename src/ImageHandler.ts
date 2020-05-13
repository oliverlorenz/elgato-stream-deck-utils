import requestPromiseNative from 'request-promise-native';

export class ImageHandler {

  static async getRandomImage(xIconSize: number) {
    return this.getImageFromWeb(`https://picsum.photos/${xIconSize}`);
  }

  static async getImageFromWeb(url: string) {
    return await requestPromiseNative(url, {
      encoding: null,
    });
  }
}
