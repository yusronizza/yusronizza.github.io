import { apiPost } from "./client";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResult = { queued: boolean; message: string };

export const contactApi = {
  send: (payload: ContactPayload) => apiPost<ContactResult, ContactPayload>("/contact", payload),
};
