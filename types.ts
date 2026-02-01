
export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Project {
  id: string;
  title: string;
  link?: string;
  description: string;
}

export interface Award {
  id: string;
  title: string;
  date: string;
  issuer: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  awards: Award[];
  certifications: Certification[];
  customSections: CustomSection[];
  templateId: string;
}

export type TemplateId = 'classic' | 'modern' | 'minimalist';
