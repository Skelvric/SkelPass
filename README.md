### SkelVault

A modern, secure password manager built with Next.js and MongoDB. SkelVault provides a full-featured solution for managing, storing, and organizing passwords with enterprise-grade security.

### ✨ Features

#### Security
- **AES-256-GCM Encryption** – Military-grade encryption for all stored credentials.
- **Rate Limiting** – Protection against brute-force attacks.
- **CSRF Protection** – Cross-site request forgery mitigation.
- **Session Management** – Secure user session handling.
- **Device Management** – Track and manage authorized devices.

#### User Experience
- **Modern UI** – Built with shadcn/ui-inspired components and Framer Motion animations.
- **Full Mobile Support** – Responsive design optimized for all screen sizes.
- **Intuitive Dashboard** – Easy-to-use interface for managing passwords and profiles.
- **Profile Management** – Organize credentials by profile/workspace.

#### Architecture
- **Full-Stack** – Seamless integration between frontend and backend.
- **TypeScript** – Type-safe development throughout the application.
- **Next.js App Router** – Latest Next.js architecture patterns.
- **MongoDB** – Scalable NoSQL database for credential storage.

### 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React, Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB |
| **Authentication** | JWT, bcrypt |
| **Security** | AES-256-GCM, CSRF protection, rate limiting |
| **UI Components** | shadcn/ui patterns, custom components |

### 🚀 Getting Started

#### Prerequisites
- Node.js 16+ 
- MongoDB instance (local or cloud)
- npm or yarn

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Skelvric/SkelVault.git
   cd SkelVault
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   MONGODB_URI="Replace MongoDB Connection String!"
   MONGODB_DB="Replace Database Name!"
     
   # Auth
   # Generate With: OpenSSL Rand -base64 32
   NEXT_AUTH_SECRET="Replace Long Random String!"
     
   # Examples:
   # http://localhost:3000
   # https://vault.skelvric.com
   NEXT_AUTH_URL="http://localhost:3000"
     
   # Security
   # Generate With: OpenSSL Rand -base64 32
   ENCRYPTION_KEY="Replace Long Random Secret!"
     
   # Generate With: OpenSSL Rand -base64 16
   ENCRYPTION_SALT="Replace Base64 Random Salt!"
     
   # Environment
   # Development - Local Development
   # Production  - Production Deployment
   # Test        - Automated Testing
   NODE_ENV="development"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### 📁 Project Structure

```
├── app/                    # Next.js App Router pages and layouts
├── components/             # React components (UI, forms, etc.)
├── lib/                    # Utility functions and helpers
├── types/                  # TypeScript type definitions
├── middleware.ts           # Next.js middleware (auth, CSRF, etc.)
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

### 🔐 Security Considerations

SkelVault implements multiple layers of security:

- **Encryption in Transit** – All data transmitted over HTTPS.
- **Encryption at Rest** – Passwords encrypted with AES-256-GCM before storage.
- **Authentication** – JWT-based authentication with secure session management.
- **Rate Limiting** – API endpoints protected against brute-force attacks.
- **CSRF Protection** – Cross-site request forgery tokens on all state-changing operations.
- **Device Tracking** – Monitor which devices have access to your account.
- **Password Hashing** – User passwords hashed with bcrypt before storage.

### 🎨 UI/UX Highlights

- **Smooth Animations** – Framer Motion for polished interactions.
- **Responsive Design** – Mobile-first approach with perfect tablet and desktop support.
- **Accessibility** – Semantic HTML and ARIA labels for screen readers.
- **Dark Mode Support** – Tailwind CSS theme configuration.
- **Performance Optimized** – Lazy loading, code splitting, and image optimization.

### 🚢 Desktop Application

SkelVault can be packaged as a thin Electron wrapper that loads the web application directly. This provides:

- **Cross-Platform** – Windows, macOS, and Linux support.
- **Native Integration** – System notifications and shortcuts.
- **Offline Caching** – Service Worker support for offline functionality.

### 📝 Environment Variables

See `.env.example` for all available configuration options.

### Essential Variables
 
- `MONGODB_URI` – MongoDB connection string.
- `MONGODB_DB` – MongoDB database name.
- `NEXT_AUTH_SECRET` – Secret key for NextAuth.js (generate with `openssl rand -base64 32`).
- `NEXT_AUTH_URL` – Application URL for authentication callbacks.
- `ENCRYPTION_KEY` – Base64-encoded AES-256 key for password encryption (generate with `openssl rand -base64 32`).
- `ENCRYPTION_SALT` – Base64-encoded salt for encryption (generate with `openssl rand -base64 16`).
- `NODE_ENV` – Environment mode (development, production, or test).

### 🧪 Development

#### Running Tests
```bash
npm run test
```

#### Building for Production
```bash
npm run build
npm start
```

#### Linting and Formatting
```bash
npm run lint
npm run format
```

### 📊 Performance Optimizations

- **Next.js Image Optimization** – Automatic image resizing and format conversion.
- **Code Splitting** – Route-based code splitting with dynamic imports.
- **Bundle Analysis** – Optimized JavaScript bundle size.
- **Database Indexing** – Strategic MongoDB index placement.
- **API Caching** – Strategic use of caching headers.

### 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature/feature`).
5. Open a Pull Request.

### 📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

### 🔗 Links

- **Live App:** [vault.skelvric.com](https://vault.skelvric.com).
- **GitHub:** [github.com/Skelvric/SkelVault](https://github.com/Skelvric/SkelVault).
- **Issues:** [Report a bug or request a feature](https://github.com/Skelvric/SkelVault/Issues).

### ⚠️ Security Disclaimer

While SkelVault implements strong security practices, it is provided as-is. For production use, conduct a security audit. Users are responsible for:

- Using strong, unique master passwords.
- Keeping their devices secure.
- Regularly updating the application.
- Enabling two-factor authentication where available.

### 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or visit the live application.

Made with ❤️ by [Skelvric](https://skelvric.com).
