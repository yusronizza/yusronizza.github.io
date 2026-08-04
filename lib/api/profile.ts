import { cache } from "react";
import { apiFetch } from "./client";
import type {
  Profile,
  SkillGroup,
  EducationEntry,
  CertificationEntry,
  AwardEntry,
  VolunteeringEntry,
} from "@/lib/domain/types";

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
  website: string;
  bio: string[];
  skills: SkillGroup[];
  experience: RawExperience[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  awards: AwardEntry[];
  volunteering: VolunteeringEntry[];
  languages: { name: string; level: string }[];
  interests: string[];
  created_at: string;
};

function toProfile({ experience, created_at: createdAt, ...rest }: RawProfile): Profile {
  return {
    ...rest,
    createdAt,
    experience: experience.map(({ start_date: startDate, end_date: endDate, ...e }) => ({
      ...e,
      startDate,
      endDate,
    })),
  };
}

export const getProfile = cache(async (): Promise<Profile> => {
  const res = await apiFetch<{ data: RawProfile }>("/public/profile");
  return toProfile(res.data);
});
