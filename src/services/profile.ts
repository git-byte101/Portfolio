import { getProfileSettings } from "@/services/site-content";

const DEFAULT_PROFILE_PHOTO = "/images/mecha-profile-photo.svg";

export async function getProfilePhotoSrc(): Promise<string> {
  const settings = await getProfileSettings();
  return settings.profilePhotoSrc || DEFAULT_PROFILE_PHOTO;
}
