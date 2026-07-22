<div align="center">

#  macOS Sequoia & iOS 18 Hybrid Portfolio OS

<p align="center">
  <b>A high-fidelity, interactive desktop & mobile operating system web simulator built with React 19, TypeScript, and Tailwind CSS.</b>
</p>

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-v8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-v12.4-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge?style=for-the-badge)](LICENSE)

[🌐 **Live Demo**](https://hybrid-os.vercel.app/) &nbsp;|&nbsp; [💻 **Author Portfolio**](https://santhoshh.xyz/) &nbsp;|&nbsp; [📫 **Contact Author**](mailto:heysanthoshreddy@gmail.com)

---

</div>

## 📌 Executive Overview

**macOS Sequoia & iOS 18 Hybrid Portfolio OS** is a state-of-the-art web application designed to simulate Apple's flagship operating systems—**macOS Sequoia** and **iOS 18**—seamlessly within a single unified React experience. 

Built from the ground up using **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**, this project combines interactive window management, real-time live telemetry data pipelines, procedural audio synthesis via the **Web Audio API**, and glassmorphism design standards to deliver a creative developer portfolio experience.

---

## ✨ Key Features & Highlights

### 💻 macOS Sequoia Desktop Mode
- **Translucent Menu Bar:** Frosted glass navigation with responsive menus (`rounded-[14px]`), active indicators, system stats, and quick toggles.
- **Window Management System:** Full drag-and-drop, z-index layering, window minimize/maximize/close traffic controls, and responsive boundary constraints.
- **Interactive Desktop Widgets:** 3D-feel floating panels (`rounded-[32px]`) featuring live weather updates, an animated Analog Clock dial, interactive calendar grid, system sliders, battery status, and orbital ISS tracking.
- **Central Ambient Clock:** High-contrast, large-scale day/date/time display with dynamic wallpaper backdrops.
- **Spotlight Search (`Cmd/Ctrl + K`):** Quick launcher modal supporting keyboard navigation to launch apps, query skills, or inspect project indexes.

### 📱 iOS 18 Mobile Mode (SpringBoard)
- **Interactive Lock Screen:** Native-feel Lock Screen with quick-action controls for **Flashlight** (triggers an ambient light cone linked to system brightness) and **Camera** (instant unlock & gallery transition), complete with a pulsing home bar indicator.
- **Dynamic Island Status Bar:** Morphing capsule pill responding dynamically to volume adjustment, display brightness shifts, and track changes. Expands into a full media controller with animated frequency equalizer bars during music playback.
- **Control Center Layout:** Gesture-supported vertical slider controls for display brightness and volume, alongside 2x2 network connectivity toggles.
- **Icon Appearance Tinting:** Customize Home Screen icons in real-time. Toggle between **Light**, **Dark**, and **Tinted** configurations with five curated iOS accent color templates.

---

## 📱 Simulated Native Applications

Each simulated application mirrors the design language, typography, and UX patterns of official Apple software:

| Application | Icon | Core Functionality |
| :--- | :---: | :--- |
| **Settings** | ⚙️ | iOS-style system settings hierarchy, user iCloud profile card, category groups, and theme toggles. |
| **Messages** | 💬 | iMessage conversation thread simulator featuring blue/gray speech bubbles and contact details. |
| **Safari** | 🧩 | Floating address bar capsule with navigation controls, search indexing templates, and bookmark shortcuts. |
| **Spotify & VLC** | 🎵 | Vinyl record spinning animation, track metadata visualization, glowing album backdrops, and Web Audio synthesizer. |
| **Notes** | 📝 | Multi-folder layout detailing career milestones, technical expertise, and developer notes. |
| **Photos** | 🖼️ | Grid album catalog of project showcases with scale transformations and high-resolution lightbox previews. |
| **Finder** | 📁 | Translucent sidebar file manager with tags, breadcrumb navigation, and personal portfolio summary. |
| **VS Code & Discord** | 💻 | Embedded code viewer & real-time Discord presence pane via the Lanyard WebSocket integration. |

---

## ⚡ Real-Time Data Pipelines & Web Audio Engine

- **Web Audio Ambient Synthesizer:** Built-in procedural ambient chord synth that generates generative audio loops directly in the browser when sound is activated.
- **Discord Lanyard API (REST/WebSocket):** Real-time integration streaming live Discord status, current activity (VS Code, Spotify, Games), and KV store bio quotes.
- **Last.fm & iTunes Search API:** Tracks real-time music scrobbles and queries the iTunes API to fetch 600x600px high-definition album artwork dynamically.
- **ISS Orbital Astronaut Tracker:** Fetches live JSON data on the current count of humans in orbit aboard the International Space Station.

---

## 🛠️ Tech Stack Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | [React 19](https://react.dev/) | Component architecture & client-side state management |
| **Language** | [TypeScript 6.0](https://www.typescriptlang.org/) | End-to-end type safety and custom interface definitions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | CSS-first utility classes, CSS variables, & glassmorphism |
| **Animations** | [Framer Motion v12](https://www.framer.com/motion/) | Window drag physics, SpringBoard transitions, & UI micro-interactions |
| **Build Tooling** | [Vite 8](https://vite.dev/) | Ultra-fast HMR dev server & production bundling |
| **Iconography** | [Lucide React](https://lucide.dev/) | Scalable vector icon system |
| **Sound Engine** | Web Audio API | Native procedural ambient synthesizer engine |

---

## 📂 Project Structure

```
macos-portfolio/
├── public/                     # Static public assets, favicons, & images
├── src/
│   ├── assets/                 # SVGs, wallpaper backdrops, & media assets
│   ├── components/
│   │   ├── desktop/            # macOS Sequoia specific components
│   │   │   ├── DesktopWidgets.tsx   # Live weather, calendar, clock, battery, & ISS widgets
│   │   │   ├── Dock.tsx             # Animated desktop Dock launcher
│   │   │   ├── LockScreen.tsx       # macOS desktop lock screen overlay
│   │   │   ├── MenuBar.tsx          # Frosted glass top menu bar
│   │   │   ├── Spotlight.tsx        # Cmd+K search palette modal
│   │   │   └── Window.tsx           # Draggable/resizable window wrapper
│   │   ├── mobile/             # iOS 18 specific components
│   │   │   ├── AppView.tsx          # Fullscreen mobile app window container
│   │   │   ├── Springboard.tsx      # iOS home screen, grid, & Control Center
│   │   │   └── StatusBar.tsx        # Dynamic Island status bar & audio pill
│   │   ├── shared/             # Shared app views & section views
│   │   │   ├── SectionContent.tsx   # Content renderer for Settings, Messages, Safari, Notes, etc.
│   │   │   ├── sectionsData.ts      # Structured data for projects, skills, & profile info
│   │   │   └── tokens.ts            # Design system tokens & accent color presets
│   │   └── ui/                 # Reusable low-level primitives
│   ├── hooks/
│   │   └── useLiveAPI.ts       # Custom hook for Lanyard, Last.fm, iTunes, & ISS live polling
│   ├── App.css                 # Custom glassmorphism & backdrop-filter utility CSS
│   ├── App.tsx                 # Main application orchestration & layout controller
│   ├── index.css               # Tailwind CSS v4 directives
│   └── main.tsx                # Application root entry point
├── developer_details.txt       # Technical portfolio source data & API parameters
├── package.json                # Project dependencies and script scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite environment build configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** installed on your system:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)

### Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/santjsx/mac_portfolio.git
   cd mac_portfolio
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 📜 Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches the Vite local development server with HMR. |
| `npm run build` | Runs TypeScript typechecks (`tsc -b`) and builds production bundles to `/dist`. |
| `npm run lint` | Runs `oxlint` for fast static code analysis and linting. |
| `npm run preview` | Starts a local web server to preview the production build in `/dist`. |

---

## ⚙️ Live Telemetry & API Customization

To customize the live integrations for your own profile:

1. **Discord Presence (Lanyard API):**
   Update the Discord user ID in [`src/hooks/useLiveAPI.ts`](file:///c:/Users/heysa/Documents/Dev/macos%20portfolio/src/hooks/useLiveAPI.ts):
   ```typescript
   const LANYARD_DISCORD_ID = "YOUR_DISCORD_USER_ID";
   ```

2. **Music Activity (Last.fm & iTunes):**
   Update your Last.fm username and API key in [`src/hooks/useLiveAPI.ts`](file:///c:/Users/heysa/Documents/Dev/macos%20portfolio/src/hooks/useLiveAPI.ts):
   ```typescript
   const LASTFM_USER = "YOUR_LASTFM_USERNAME";
   const LASTFM_API_KEY = "YOUR_LASTFM_API_KEY";
   ```

---

## 🤝 Contributing

Contributions, feature suggestions, and bug reports are welcome!

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 👨‍💻 Author & Contact

**Santhosh Reddy** *(santjsx)*
- **Portfolio:** [santhoshh.xyz](https://santhoshh.xyz/)
- **Live OS Demo:** [hybrid-os.vercel.app](https://hybrid-os.vercel.app/)
- **GitHub:** [@santjsx](https://github.com/santjsx)
- **X (Twitter):** [@Santhoshh_void](https://x.com/Santhoshh_void)
- **Email:** [heysanthoshreddy@gmail.com](mailto:heysanthoshreddy@gmail.com)

<div align="center">
  <sub>Crafted with precision by Santhosh Reddy. Powered by React 19 & Tailwind CSS.</sub>
</div>