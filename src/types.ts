// src/types.ts

export type User = {
  id?: string;         // optional to allow partial updates safely
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  // add other fields your app uses
};

export type RegionData = {
  country: string;
  code: string;
  city?: string;
  state?: string;
};

export type Language = "en" | "hi" | "mr" | "gu" | "ta" | "te" | string;

export type AppSession = {
  user?: User | null;
  language?: Language | null;
  region?: RegionData | null;
  // some session runtimes expose save(), keep it optional
  save?: () => Promise<void>;
} | null;

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type EventItem = {
  id: number;
  title: string;
  image: string;
  dateTime: string;
  location: string;
  price: string;
  category?: string | null;
};

export type SectionRefs = {
  [key: string]: React.RefObject<HTMLDivElement | null> | undefined;
};
