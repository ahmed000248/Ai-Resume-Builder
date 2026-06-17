export type ResumeFormData = {
  personal: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    portfolio: string;
  };
  experience: Array<{
    company: string;
    role: string;
    description: string;
    startDate: string;
    endDate: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
};
