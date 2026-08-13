export type Profile = {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  phoneNumber: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginDevice = {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  browser: string;
  os: string;
  lastSeenAt: string;
  createdAt: string;
};
