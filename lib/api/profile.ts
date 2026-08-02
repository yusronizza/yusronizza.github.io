import type { Profile, SkillGroup, ExperienceEntry, EducationEntry, CertificationEntry, AwardEntry } from "@/lib/data/profile";
import { apiGet, apiGetList } from "./client";

export const profileApi = {
  get: () => apiGet<Profile>("/profile"),
  skills: () => apiGetList<SkillGroup>("/profile/skills"),
  experience: (params?: { current?: boolean }) => {
    const qs = params?.current ? "?current=true" : "";
    return apiGetList<ExperienceEntry>(`/profile/experience${qs}`);
  },
  education: () => apiGetList<EducationEntry>("/profile/education"),
  certifications: () => apiGetList<CertificationEntry>("/profile/certifications"),
  awards: () => apiGetList<AwardEntry>("/profile/awards"),
};
