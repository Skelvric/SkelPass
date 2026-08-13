### 🔐 SkelPass

A modern, privacy-focused password manager built for the web. Manage your passwords from a clean, secure vault with client-side encryption.

SkelPass is a modern password manager built with Next.js, TypeScript, Tailwind CSS and Supabase.

The project is focused specifically on password management. Vault data is encrypted in the browser before it is stored in Supabase.

#### ✨ Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Web Crypto API
- Electron Windows desktop application

### 🚀 Features

#### 🔑 Authentication

- Email/password registration
- Login/logout
- Protected dashboard
- Onboarding after registration

#### 👋 Onboarding

Users configure:

- First name
- Last name
- Username
- Profile image
- Vault master password

#### 🗄️ Password Vault

- Create passwords
- Edit passwords
- Delete passwords
- Search passwords
- Copy username/password
- Show/hide password
- Secure password generator
- Vault lock/unlock

#### 🛡️ Security

Vault encryption is performed client-side using the Web Crypto API.

The current encryption flow uses:

- PBKDF2
- SHA-256
- AES-256-GCM
- Random per-operation IVs
- Random KDF salt

Plaintext vault passwords are not stored in Supabase.

The master password itself is never stored.

#### 👤 Profile

Users can manage:

- Profile image
- First name
- Last name
- Username
- Bio
- Location
- Website
- Phone number

Users can also delete their account and view registered/login devices.

### 📁 Project Structure

```text
skelpass/
├── app/
│   ├── (marketing)/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   ├── onboarding/
│   ├── profile/
│   ├── register/
│   └── ...
├── components/
│   ├── AuthForm/
│   ├── DashboardShell/
│   ├── Footer/
│   ├── Header/
│   ├── PasswordManager/
│   ├── Sidebar/
│   └── ...
├── data/
│   └── content.ts
├── lib/
│   ├── crypto/
│   └── supabase/
├── public/
│   └── downloads/
├── supabase/
│   └── migrations/
│       └── schema.sql
├── types/
├── .env.example
├── next.config.ts
├── package.json
└── proxy.ts
```

The project follows component-based architecture and colocated component files.

Example:

```text
components/Example/
├── Example.tsx
└── Example.module.css
```

Static UI text is kept in:

```text
data/content.ts
```

### 🗃️ Database

The main application tables are:

```text
auth.users
    │
    ├── profiles
    ├── vaultSettings
    ├── passwords
    └── loginDevices
```

#### vaultSettings

Stores vault configuration and verification material.

It does not store the user's master password.

#### passwords

Stores encrypted password records.

Typical fields:

```text
id
userId
encryptedData
encryptionIv
encryptionVersion
createdAt
updatedAt
```

#### profiles

Stores user profile information.

#### loginDevices

Stores application-level device information for authenticated users.

### ⚡ Supabase Setup

Create a Supabase project and configure the environment variables.

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=Your_Publishable_Key

SUPABASE_SERVICE_ROLE_KEY=Your-Service-Role-Key
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only.

Never expose it through:

- `NEXT_PUBLIC_*`
- Client Components
- browser JavaScript
- Git repositories

Run the database schema from:

```text
supabase/migrations/schema.sql
```

The schema enables Row Level Security and grants authenticated users access only to their own records.

### 🛠️ Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 🚢 Production

Before deployment:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

Then start the production server:

```bash
npm start
```

Configure the production environment variables in the hosting provider.

Do not commit `.env.local`.

### 🗑️ Account Deletion

Account deletion is handled server-side.

The application uses the Supabase Admin API to delete the authenticated user.

The service role key must only be available to the server-side account deletion route.

Related data should be removed through the configured foreign-key cascade relationships.

### 🔒 Security Notes

SkelPass is designed so that the Supabase database does not need plaintext vault passwords.

The general data flow is:

```text
Master Password
      │
      ▼
PBKDF2 / SHA-256
      │
      ▼
AES-256-GCM Key
      │
      ▼
Browser-side encryption
      │
      ▼
Supabase ciphertext
```

Supabase Row Level Security restricts records using the authenticated user's ID.

For production, verify the complete authentication and vault lifecycle in the deployed environment.

### 🎨 Code Style

The project uses:

- TypeScript
- camelCase property and database column naming
- Semicolons
- Colocated components
- CSS Modules where component-specific styling is required
- Tailwind CSS for utility styling
- Server Components by default
- Client Components only where browser interactivity is required

Example:

```ts
const password = {
  userId: user.id,
  encryptedData,
  encryptionIv,
  encryptionVersion: 1,
};
```

### 📄 License

SkelPass is released under the MIT License.

Copyright © 2026 SkelPass.

See the [`LICENSE.txt`](LICENSE.txt) file for the complete license text.
