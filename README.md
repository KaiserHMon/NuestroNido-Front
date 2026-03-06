# NuestroNido 🐦

NuestroNido (Our Nest) is a collaborative household management platform designed to help families and housemates organize their daily lives. From task management and shared calendars to notes and a gamified leaderboard, NuestroNido turns household chores into a shared, rewarding experience.

## ✨ Features

- **🏠 Family Management**: Create or join a "nest" to collaborate with your family members or roommates.
- **📅 Shared Calendar**: Keep track of important dates, events, and deadlines in one central place.
- **📝 Task Lists & Chores**: Organize household tasks and track progress.
- **🏆 Gamification**: Earn points and level up by completing tasks. A leaderboard keeps everyone motivated!
- **🗒️ Shared Notes**: Quick access to shopping lists, recipes, or important household information.
- **🔔 Push Notifications**: Stay updated on new tasks, mentions, and family updates.
- **🌐 Multilingual Support**: Fully localized in English and Spanish.
- **📱 Responsive Design**: Optimized for both desktop and mobile devices.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **State Management & Data Fetching**: Custom hooks and services with [React Context](https://react.dev/learn/passing-data-deeply-with-context).
- **Testing**: [Vitest](https://vitest.dev/) for unit/component tests and [Playwright](https://playwright.dev/) for E2E testing.

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (preferred) or `npm` / `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nuestronido.git
   cd nuestronido/front
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add your configuration (API URLs, etc.).

### Running the App

- **Development Mode**:
  ```bash
  pnpm dev
  ```
  The app will be available at `http://localhost:3000`.

- **Build for Production**:
  ```bash
  pnpm build
  pnpm start
  ```

## 📁 Project Structure

```text
├── app/                  # Next.js App Router (Internationalized)
│   ├── [locale]/         # Routes wrapped in locale segments
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── auth/             # Authentication related components
│   ├── dashboard/        # Dashboard specific sections
│   ├── dialogs/          # Reusable modal dialogs
│   ├── ui/               # Base UI components (Shadcn/UI)
│   └── ...               # Feature-specific components
├── hooks/                # Custom React hooks (auth, notification, etc.)
├── i18n/                 # Internationalization configuration
├── lib/                  # Utility functions, constants, and types
├── messages/             # Translation files (en.json, es.json)
├── public/               # Static assets (images, icons, etc.)
├── services/             # API service layers (auth, task, family, etc.)
├── styles/               # Global CSS and Tailwind configuration
└── tests/                # Vitest and Playwright test suites
```

## 🧪 Testing

- **Run Unit Tests**:
  ```bash
  pnpm test
  ```
- **Test UI (Vitest)**:
  ```bash
  pnpm test:ui
  ```
- **Linting**:
  ```bash
  pnpm lint
  ```

## 📜 License

This project is private and for internal use only.

---

Made with ❤️ by the NuestroNido Team.
