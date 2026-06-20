import { siteConfig } from "@/lib/config/site";
import type { Profile } from "@/lib/data/profile";

export function ContactRow({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border py-6 text-sm text-muted">
      <span>{profile.location}</span>
      <span>{profile.phone}</span>
      <a href={siteConfig.social.email} className="transition-colors hover:text-accent">
        {siteConfig.author.email}
      </a>
      <a
        href={profile.website}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-accent"
      >
        {profile.website.replace(/^https?:\/\//, "")}
      </a>
    </div>
  );
}
