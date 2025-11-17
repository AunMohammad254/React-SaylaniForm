
# Saylani Admission Form (SMIT) – React + Vite

Modern, responsive admission form with proper client-side validations for SMIT (Saylani Mass IT Training). Includes registration flow and a downloadable student ID card preview.

<br/>

<a href="#-getting-started"><img alt="Build" src="https://img.shields.io/badge/build-vite%207-blue?logo=vite"/></a>
<a href="#-project-structure"><img alt="Framework" src="https://img.shields.io/badge/react-19.2.0-61DAFB?logo=react&logoColor=white"/></a>
<a href="#-project-structure"><img alt="Styling" src="https://img.shields.io/badge/tailwindcss-4.1.17-06B6D4?logo=tailwindcss&logoColor=white"/></a>
<img alt="Version" src="https://img.shields.io/badge/version-0.0.0-black"/>
<img alt="CI" src="https://img.shields.io/badge/CI-Not%20Configured-lightgrey"/>
<img alt="License" src="https://img.shields.io/badge/license-Unspecified-lightgrey"/>
<img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen"/>

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build & Preview](#build--preview)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
  - [Registration Form](#registration-form)
  - [Download ID Card](#download-id-card)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)
- [Resources](#-resources)

---

## 🔎 Overview

This project implements an admission registration flow for SMIT with:
- Accessible, mobile-first UI built with React 19 and Tailwind CSS v4
- Client-side validations for email, phone, and CNIC formats
- Multi-route navigation powered by React Router
- ID card preview and print/download actions

Primary routes:
- `/` – registration form
- `/download-id` – search by CNIC and preview a printable ID card

---

## 🚀 Getting Started

### Prerequisites
- `Node.js` >= 18
- Any package manager: `npm`, `pnpm`, `yarn`, or `bun`

### Installation

Using `npm`:

```bash
npm install
```

Using `pnpm`:

```bash
pnpm install
```

Using `yarn`:

```bash
yarn install
```

Using `bun`:

```bash
bun install
```

### Development

Start the local dev server with hot module reloading:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run vite
```

The app runs at `http://localhost:5173/` by default (Vite).

### Build & Preview

```bash
# build a production bundle
npm run build

# preview the built app locally
npm run preview
```

---

## 🗂 Project Structure

```text
saylani-form/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ assets/
│  │  └─ react.svg
│  ├─ components/
│  │  ├─ DownloadIdCard.jsx        # ID card search, preview, print/download
│  │  ├─ FormInput.jsx             # Reusable input with label + error
│  │  ├─ Header.jsx                # Top navigation/header
│  │  ├─ RegistrationForm.jsx      # Main registration form
│  │  └─ SocialLinks.jsx           # Social media links
│  ├─ constants/
│  │  └─ formOptions.js            # Static options for selects
│  ├─ hooks/
│  │  └─ useFormValidation.js      # Validation hook (if used)
│  ├─ utils/
│  │  └─ validation.js             # Email/Phone/CNIC validators
│  ├─ App.css
│  ├─ App.jsx                      # Router and page shell
│  ├─ index.css
│  └─ main.jsx                     # App bootstrap
├─ index.html
├─ eslint.config.js
├─ package.json
├─ package-lock.json
├─ vite.config.js
└─ README.md
```

Key technologies:
- React `19.2.0`, React DOM `19.2.0`
- Vite `7.2.2` with `@vitejs/plugin-react`
- Tailwind CSS `4.1.17`
- React Router DOM `7.9.6`
- lucide-react icons `0.554.0`

---

## 🧭 Usage

### Registration Form
- Navigate to `/`.
- Fill in required fields: name, father's name, email, phone, CNIC, etc.
- Client-side validation highlights invalid inputs.
- Submit to proceed (demo submit handler can be extended to call an API).

<img src="https://via.placeholder.com/1200x600?text=Registration+Form+Preview" alt="Registration Form preview" width="800" />

### Download ID Card
- Navigate to `/download-id`.
- Enter CNIC (13 digits or `#####-#######-#` format).
- On a match, a printable ID card preview appears with student meta.
- Use the `Download` button or the browser `Print` dialog.

<img src="https://via.placeholder.com/1200x600?text=ID+Card+Preview" alt="ID Card preview" width="800" />

---

## ⚙️ Configuration

Environment variables (`.env` at project root):

```dotenv
# Example API base for form submissions
VITE_API_BASE_URL=

# Toggle mock data for ID card route
VITE_ENABLE_MOCK_DATA=true
```

Notes:
- Only `VITE_`-prefixed variables are exposed to the browser.
- Tailwind v4 runs with its built-in config; extend via `@import` utilities or a config file if needed.
- ESLint is configured via `eslint.config.js` and can be run with `npm run lint`.

---

## 🤝 Contributing

1. Fork the repo and create a feature branch:
   ```bash
   git checkout -b feat/your-feature
   ```
2. Install dependencies and run the app:
   ```bash
   npm install && npm run dev
   ```
3. Ensure code style passes:
   ```bash
   npm run lint
   ```
4. Push and open a pull request with a clear description, screenshots if UI changes, and implementation notes.

Guidelines:
- Keep components small and composable.
- Follow existing naming and folder conventions.
- Prefer utility functions in `src/utils` and constants in `src/constants`.

---

## 📄 License

No explicit license is currently declared for this repository.

If you plan to open-source the project, consider adding an OSI-approved license (e.g., MIT) and updating `package.json` with a `license` field. See: https://choosealicense.com/

---

## 🔗 Resources

- React: https://react.dev/
- Vite: https://vite.dev/
- Tailwind CSS: https://tailwindcss.com/
- React Router: https://reactrouter.com/
- lucide-react: https://lucide.dev/
- SMIT: https://saylaniwelfare.com/


---

<div align="center">

Made with 💖 By Aun Abbas

</div>