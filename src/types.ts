export type CVData = {
  name: string;
  summary: string;
  skills: string[];
  phone: string;
  email: string;
  location: string;
  socials: { platform: string; handle: string }[];
  education: { degree: string; school: string; location: string; date: string }[];
  experience: { title: string; company: string; location: string; date: string; bullets: string[] }[];
  hobbies?: string[];
  references?: { name: string; contact: string; relationship: string }[];
  themeColor: string;
};

export type SavedCV = {
  id: string;
  name: string;
  lastModified: number;
  data: CVData;
};

export const DEFAULT_CV_DATA: CVData = {
  name: "",
  summary: "",
  skills: [],
  phone: "",
  email: "",
  location: "",
  socials: [],
  education: [],
  experience: [],
  themeColor: "#334155",
};
