export type AppUser = {
  sub: string;
  name: string;
  email: string;
  role: string;
  language: string;
  age_group: string;
  picture: string;
  image?: string; // Added for NextAuth compatibility
};
