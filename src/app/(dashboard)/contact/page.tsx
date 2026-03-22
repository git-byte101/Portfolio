import { ContactView } from "./contact-view";
import {
  getProfileSettings,
  getSocialLinks,
  getToolBadges,
} from "@/services/site-content";

export const revalidate = 60;

export default async function ContactPage() {
  const [profileSettings, socialLinks, toolBadges] = await Promise.all([
    getProfileSettings(),
    getSocialLinks(),
    getToolBadges(),
  ]);

  return (
    <ContactView
      heading={profileSettings.contactHeading}
      intro={profileSettings.contactIntro}
      bio={profileSettings.contactBio}
      highlights={profileSettings.contactHighlights}
      socialLinks={socialLinks}
      toolBadges={toolBadges.map((badge) => badge.name)}
    />
  );
}
