# elgato-stream-deck-utils

some useful classes to make work with [elgato-stream-deck](https://www.npmjs.com/package/elgato-stream-deck) a little bit more convinient.

## example

```
import 'source-map-support/register';
import { Device } from './Device';
import { ProfileManager } from './Profile/manager';
import { ProfileNextButton } from './Button/Functional/Profile/Next';

const device = new Device();

(async () => {
  device.waitForConnect(async streamDeck => {
    streamDeck.clearAllKeys();
    const profileManager = new ProfileManager(streamDeck);
    const profile0 = profileManager.getProfile(0);
    const profile1 = profileManager.getProfile(1);
    profile0.addButton(7, new ProfileNextButton(streamDeck.ICON_SIZE));
    profile1.addButton(15, new ProfileNextButton(streamDeck.ICON_SIZE));

    await profile0.activate();
    await profileManager.start();
  });
})();
```
