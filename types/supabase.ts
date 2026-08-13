export type Json = string | number | boolean | null | {
  [key: string]: Json | undefined;
} | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          userId: string;
          firstName?: string;
          lastName?: string;
          username?: string;
          avatarUrl?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          phoneNumber?: string | null;
          onboardingCompleted?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          firstName?: string;
          lastName?: string;
          username?: string;
          avatarUrl?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          phoneNumber?: string | null;
          onboardingCompleted?: boolean;
          updatedAt?: string;
        };
        Relationships: [
        ];
      };
      vaultSettings: {
        Row: {
          userId: string;
          kdfSalt: string;
          passwordVerifier: string;
          verifierIv: string;
          kdfIterations: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          userId: string;
          kdfSalt: string;
          passwordVerifier: string;
          verifierIv: string;
          kdfIterations?: number;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          kdfSalt?: string;
          passwordVerifier?: string;
          verifierIv?: string;
          kdfIterations?: number;
          updatedAt?: string;
        };
        Relationships: [
        ];
      };
      passwords: {
        Row: {
          id: string;
          userId: string;
          encryptedData: string;
          encryptionIv: string;
          encryptionVersion: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          encryptedData: string;
          encryptionIv: string;
          encryptionVersion?: number;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          encryptedData?: string;
          encryptionIv?: string;
          encryptionVersion?: number;
          updatedAt?: string;
        };
        Relationships: [
        ];
      };
      loginDevices: {
        Row: {
          id: string;
          userId: string;
          deviceId: string;
          deviceName: string;
          browser: string;
          os: string;
          lastSeenAt: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          deviceId: string;
          deviceName: string;
          browser?: string;
          os?: string;
          lastSeenAt?: string;
          createdAt?: string;
        };
        Update: {
          deviceId?: string;
          deviceName?: string;
          browser?: string;
          os?: string;
          lastSeenAt?: string;
        };
        Relationships: [
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
