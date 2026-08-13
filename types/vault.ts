export type VaultMetadata = {
  userId: string;
  kdfSalt: string;
  passwordVerifier: string;
  verifierIv: string;
  kdfIterations: number;
  createdAt: string;
  updatedAt: string;
};

export type PasswordRecord = {
  id: string;
  userId: string;
  encryptedData: string;
  encryptionIv: string;
  encryptionVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type PasswordItem = {
  id?: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
};
