import { Profile } from '../../Profile';
import { ProfileManager } from '../../Profile/manager';

export interface ButtonEventDto {
  profile: Profile;
  profileManager: ProfileManager;
}
