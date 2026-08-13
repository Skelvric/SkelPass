const DEFAULT_ITERATIONS = 310_000;
const KEY_LENGTH = 256;
const VERIFIER = 'SKELPASS_VAULT_VERIFIER_V1';
const VERSION = 1;

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);

  new Uint8Array(buffer).set(bytes);

  return buffer;
}

function randomBytes(length: number) {
  return crypto.getRandomValues(new Uint8Array(length));
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations = DEFAULT_ITERATIONS,
) {
  const encoder = new TextEncoder();

  const passwordData = encoder.encode(password);

  const material = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(passwordData),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations,
      hash: 'SHA-256',
    },
    material,
    {
      name: 'AES-GCM',
      length: KEY_LENGTH,
    },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function createVaultMaterial(masterPassword: string) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);

  const key = await deriveKey(masterPassword, salt);

  const plaintext = new TextEncoder().encode(VERIFIER);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(iv),
    },
    key,
    toArrayBuffer(plaintext),
  );

  return {
    kdfSalt: bytesToBase64(salt),
    passwordVerifier: bytesToBase64(new Uint8Array(ciphertext)),
    verifierIv: bytesToBase64(iv),
    kdfIterations: DEFAULT_ITERATIONS,
  };
}

export async function unlockVault(
  masterPassword: string,
  material: {
    kdfSalt: string;
    passwordVerifier: string;
    verifierIv: string;
    kdfIterations: number;
  },
) {
  try {
    const salt = base64ToBytes(material.kdfSalt);
    const iv = base64ToBytes(material.verifierIv);
    const ciphertext = base64ToBytes(material.passwordVerifier);

    const key = await deriveKey(
      masterPassword,
      salt,
      material.kdfIterations,
    );

    const plain = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: toArrayBuffer(iv),
      },
      key,
      toArrayBuffer(ciphertext),
    );

    const value = new TextDecoder().decode(plain);

    if (value !== VERIFIER) {
      throw new Error('Invalid vault password');
    }

    return key;
  } catch {
    throw new Error('Invalid vault password');
  }
}

export async function encryptPasswordItem(
  item: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  },
  key: CryptoKey,
) {
  const iv = randomBytes(12);

  const plaintext = new TextEncoder().encode(
    JSON.stringify(item),
  );

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(iv),
    },
    key,
    toArrayBuffer(plaintext),
  );

  return {
    encryptedData: bytesToBase64(new Uint8Array(ciphertext)),
    encryptionIv: bytesToBase64(iv),
    encryptionVersion: VERSION,
  };
}

export async function decryptPasswordItem(
  record: {
    encryptedData: string;
    encryptionIv: string;
  },
  key: CryptoKey,
) {
  const iv = base64ToBytes(record.encryptionIv);
  const ciphertext = base64ToBytes(record.encryptedData);

  const plain = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(iv),
    },
    key,
    toArrayBuffer(ciphertext),
  );

  return JSON.parse(
    new TextDecoder().decode(plain),
  ) as {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  };
}

export function generatePassword(length = 20) {
  const alphabet =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!#$%&*+-=?@';

  const output: string[] = [];

  const max =
    Math.floor(0x1_0000_0000 / alphabet.length) *
    alphabet.length;

  while (output.length < length) {
    const values = crypto.getRandomValues(
      new Uint32Array(length),
    );

    for (const value of values) {
      if (value >= max) {
        continue;
      }

      output.push(
        alphabet[value % alphabet.length],
      );

      if (output.length === length) {
        break;
      }
    }
  }

  return output.join('');
}
