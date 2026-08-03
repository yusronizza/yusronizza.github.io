import { cache } from "react";
import { apiFetch } from "./client";
import {
  profile as localProfile,
  type Profile,
  type SkillGroup,
  type EducationEntry,
  type CertificationEntry,
  type AwardEntry,
} from "@/lib/data/profile";

type RawExperience = {
  role: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string;
  summary?: string;
  highlights: string[];
};

type RawProfile = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  bio: string[];
  email: string;
  skills: SkillGroup[];
  experience: RawExperience[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  awards: AwardEntry[];
};

function toProfile(raw: RawProfile): Profile {
  return {
    name: raw.name,
    title: raw.title,
    tagline: raw.tagline,
    location: raw.location,
    bio: raw.bio,
    skills: raw.skills,
    experience: raw.experience.map((e) => ({
      role: e.role,
      organization: e.organization,
      location: e.location,
      startDate: e.start_date,
      endDate: e.end_date,
      summary: e.summary,
      highlights: e.highlights,
    })),
    education: raw.education,
    certifications: raw.certifications,
    awards: raw.awards,
    // Fields not yet in the API — kept from local data
    phone: localProfile.phone,
    website: localProfile.website,
    volunteering: localProfile.volunteering,
    languages: localProfile.languages,
    interests: localProfile.interests,
  };
}

export const getProfile = cache(async (): Promise<Profile> => {
  const res = await apiFetch<{ data: RawProfile }>("/profile");
  return toProfile(res.data);
});
