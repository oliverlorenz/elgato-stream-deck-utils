import { Profile } from '.';
import { StreamDeck } from 'elgato-stream-deck';
import { ButtonEventDto } from '../Button/event/dto';

export class ProfileManager {
  private profiles: Map<number, Profile> = new Map<number, Profile>();
  private currentProfileIndex: number = 0;

  constructor(private streamDeck: StreamDeck) {}

  public getProfile(profileIndex: number): Profile {
    if (!this.profiles.has(profileIndex)) {
      const newProfile = new Profile(this.streamDeck);
      this.profiles.set(profileIndex, newProfile);
      if (this.profiles.size === 1) {
        this.currentProfileIndex = profileIndex;
        this.activateProfile(profileIndex);
      }
    }

    return this.profiles.get(profileIndex) as Profile;
  }

  public currentProfile() {
    return this.getProfile(this.currentProfileIndex);
  }

  public nextProfile() {
    this.deactivateProfile(this.currentProfileIndex);
    if (!this.profiles.has(this.currentProfileIndex + 1)) {
      this.currentProfileIndex = 0;
    } else {
      this.currentProfileIndex++;
    }
    this.activateProfile(this.currentProfileIndex);
    return this.getProfile(this.currentProfileIndex);
  }

  public activateProfile(profileIndex: number) {
    this.getProfile(profileIndex).activate();
  }

  public deactivateProfile(profileIndex: number) {
    this.getProfile(profileIndex).deactivate();
  }

  public start() {
    const dto: ButtonEventDto = {
      profile: this.currentProfile(),
      profileManager: this,
    };
    this.streamDeck.on('up', (buttonIndex: number) => {
      const currentProfile = this.currentProfile();
      if (!currentProfile.hasButtonByIndex(buttonIndex)) return;
      currentProfile.getButtonByIndex(buttonIndex).emitKeyUp(dto);
    });
    this.streamDeck.on('down', (buttonIndex: number) => {
      const currentProfile = this.currentProfile();
      if (!currentProfile.hasButtonByIndex(buttonIndex)) return;
      currentProfile.getButtonByIndex(buttonIndex).emitKeyDown(dto);
    });
  }
}
