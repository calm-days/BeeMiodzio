// Drizzle ORM schema placeholder
// Install drizzle-orm and @neondatabase/serverless to activate
//
// Tables: users, hives, subscriptions, updates, scale_readings
// See tech doc for full ER diagram

export type User = {
  id: string;
  email: string;
  name: string;
  role: "client" | "admin";
  createdAt: Date;
};

export type Hive = {
  id: string;
  name: string;
  beekeeperId: string;
  location: string;
  cameraStreamUrl: string | null;
  hasPersonalCamera: boolean;
};

export type Subscription = {
  id: string;
  userId: string;
  hiveId: string;
  plan: "eighth" | "third" | "full";
  addons: string[];
  stripeSubscriptionId: string | null;
  status: "active" | "expired" | "cancelled";
  startDate: Date;
  endDate: Date;
};

export type Update = {
  id: string;
  hiveId: string;
  date: Date;
  text: string;
  photos: string[];
  type: "daily" | "seasonal" | "honey_shipped";
};

export type ScaleReading = {
  id: string;
  hiveId: string;
  recordedAt: Date;
  weightKg: number;
  temperature: number;
  humidity: number;
};
