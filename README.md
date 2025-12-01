
<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:16a34a,100:22c55e&height=200&section=header&text=SMIT%20Admission%20Form&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Saylani%20Mass%20IT%20Training%20Program&descSize=20&descAlignY=55" width="100%"/>

<!-- Animated Typing -->
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=16A34A&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=Modern+React+19+%2B+Vite+7+Application;Beautiful+UI+with+Tailwind+CSS+v4;Complete+Validation+%26+Supabase+Backend" alt="Typing SVG" /></a>

<br/>
<br/>
<br/>
<!-- Badges Row 1 -->
<p>
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=20232A" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=1a1a1a" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind-4.1.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0f172a" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white&labelColor=1a1a1a" alt="Supabase"/>
</p>

<!-- Badges Row 2 -->
<p>
  <img src="https://img.shields.io/badge/Framer_Motion-Animations-FF0080?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/React_Router-7.9.6-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router"/>
  <img src="https://img.shields.io/badge/Lucide-Icons-F56565?style=flat-square&logo=lucide&logoColor=white" alt="Lucide"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
</p>

<!-- Quick Links -->
<p>
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-contributing">Contributing</a>
</p>

<br/>

<!-- Project Preview GIF/Image -->
<img src="https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake-dark.svg" width="100%" alt="Snake animation"/>

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 Modern UI/UX
- **Glassmorphism** design elements
- **Smooth animations** with Framer Motion
- **Responsive** mobile-first design
- **Dark/Light** mode ready CSS variables

</td>
<td width="50%">

### ⚡ Performance
- **Lazy loading** routes with React Suspense
- **Code splitting** for optimal bundle size
- **Memoized** components with React.memo
- **Debounced** inputs for efficiency

</td>
</tr>
<tr>
<td width="50%">

### 🔒 Validation
- **Email** format validation
- **Phone** (Pakistani format) validation
- **CNIC** (13-digit) validation
- **Real-time** error feedback

</td>
<td width="50%">

### 🗄️ Backend Ready
- **Supabase** database integration
- **Student** registration system
- **Results** lookup by CNIC
- **ID Card** generation & download

</td>
</tr>
</table>

---

## 🚀 Quick Start

<details open>
<summary><b>📦 Installation</b></summary>

```bash
# Clone the repository
git clone https://github.com/AunMohammad254/React-SaylaniForm.git

# Navigate to project
cd saylani-form

# Install dependencies
npm install

# Start development server
npm run dev
```

</details>

<details>
<summary><b>🔧 Environment Setup</b></summary>

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional: Enable mock data for development
VITE_ENABLE_MOCK_DATA=true
```

</details>

<details>
<summary><b>📜 Available Scripts</b></summary>

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:3000` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

</details>

---

## 📁 Project Structure

```
saylani-form/
│
├── 📂 public/                    # Static assets
│
├── 📂 src/
│   ├── 📂 assets/               # Images & media
│   │
│   ├── 📂 components/           # React components
│   │   ├── 🧩 DownloadIdCard.jsx    # ID card preview & download
│   │   ├── 🧩 ErrorBoundary.jsx     # Error handling wrapper
│   │   ├── 🧩 FormInput.jsx         # Reusable form input
│   │   ├── 🧩 Header.jsx            # Navigation header
│   │   ├── 🧩 Loading.jsx           # Loading spinner
│   │   ├── 🧩 RegistrationForm.jsx  # Main registration form
│   │   ├── 🧩 Results.jsx           # Results lookup
│   │   └── 🧩 SocialLinks.jsx       # Social media links
│   │
│   ├── 📂 constants/            # Static data & options
│   │   └── 📄 formOptions.js
│   │
│   ├── 📂 hooks/                # Custom React hooks
│   │   ├── 🪝 useDebounce.js
│   │   └── 🪝 useFormValidation.js
│   │
│   ├── 📂 styles/               # CSS utilities
│   │   └── 🎨 responsive-utilities.css
│   │
│   ├── 📂 utils/                # Helper functions
│   │   ├── 🔧 registrationApi.js
│   │   ├── 🔧 studentQueries.js
│   │   ├── 🔧 studentService.js
│   │   ├── 🔧 supabaseClient.js
│   │   └── 🔧 validation.js
│   │
│   ├── 📄 App.jsx               # Main app component
│   ├── 📄 App.css
│   ├── 📄 index.css             # Global styles
│   └── 📄 main.jsx              # Entry point
│
├── 📂 supabase/                 # Database migrations
│   ├── 📂 csv/                  # Seed data
│   └── 📂 migrations/           # SQL schemas
│
├── ⚙️ vite.config.js            # Vite configuration
├── ⚙️ eslint.config.js          # ESLint rules
└── 📄 package.json
```

---

## 📸 Screenshots

<div align="center">

### 🏠 Registration Form
<img src="https://placehold.co/800x450/16a34a/ffffff?text=Registration+Form&font=roboto" alt="Registration Form" width="80%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"/>

<br/><br/>

### 🎫 ID Card Download
<img src="https://placehold.co/800x450/22c55e/ffffff?text=ID+Card+Preview&font=roboto" alt="ID Card" width="80%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"/>

<br/><br/>

### 📊 Results Lookup
<img src="https://placehold.co/800x450/15803d/ffffff?text=Results+Page&font=roboto" alt="Results" width="80%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"/>

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|:--------:|:-------------|
| **Frontend** | ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Styling** | ![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) |
| **Animation** | ![Framer](https://img.shields.io/badge/Framer_Motion-FF0080?style=flat-square&logo=framer&logoColor=white) |
| **Backend** | ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) |
| **Routing** | ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) |
| **Icons** | ![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=flat-square&logo=lucide&logoColor=white) |

</div>

---

## 🤝 Contributing

<div align="center">

Contributions are what make the open source community amazing! 🌟

</div>

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

---

## 📄 License

<div align="center">

This project is open source and available under the [MIT License](LICENSE).

</div>

---

## 🔗 Connect & Resources

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-AunMohammad254-181717?style=for-the-badge&logo=github)](https://github.com/AunMohammad254)
[![SMIT](https://img.shields.io/badge/SMIT-Official_Site-16a34a?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wzIDEuNVY5bDcgMy41TDE5IDlWOC41TDIyIDdMMTIgMnoiLz48L3N2Zz4=)](https://saylaniwelfare.com/)

<br/>

| Resource | Link |
|:--------:|:----:|
| 📘 React Docs | [react.dev](https://react.dev/) |
| ⚡ Vite Docs | [vite.dev](https://vite.dev/) |
| 🎨 Tailwind Docs | [tailwindcss.com](https://tailwindcss.com/) |
| 🗄️ Supabase Docs | [supabase.com/docs](https://supabase.com/docs) |

</div>

---

<div align="center">

<!-- Animated Footer -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:22c55e,100:16a34a&height=120&section=footer" width="100%"/>

<br/>

**Made with 💚 by [Aun Abbas](https://github.com/AunMohammad254)**

<br/>

⭐ **Star this repo if you found it helpful!** ⭐

<br/>

<img src="https://komarev.com/ghpvc/?username=AunMohammad254&repo=React-SaylaniForm&color=16a34a&style=for-the-badge&label=VISITORS" alt="Visitors"/>

</div>
