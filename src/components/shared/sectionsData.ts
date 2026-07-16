export interface Project {
  name: string;
  tags: string[];
  summary: string;
  link: string;
  image: string;
}

export interface ExperienceItem {
  role: string;
  org: string;
  period: string;
  detail: string;
}

export interface ContactData {
  email: string;
  linkedin: string;
  github: string;
  twitter?: string;
  instagram?: string;
  spotify?: string;
  discord?: string;
}

export interface SkillItem {
  name: string;
  logo: string;
}

export interface Section {
  key: string;
  icon: string; // Path to SVG icon
  title: string;
  dockLabel: string;
  color: string;
  keywords: string[];
  data?: any;
  resumeUrl?: string;
}

export interface Person {
  name: string;
  role: string;
  bio: string;
  location: string;
  availability: string;
  photo: string;
  handle: string;
  domain: string;
}

export const person: Person = {
  name: "Santhosh Reddy",
  role: "Web Developer & Frontend Engineer",
  bio: "Web Developer & Frontend Engineer crafting high-performance productivity engines, web-based operating system mockups, and cinematic UI experiences. Passionate about WebGL, animation, and client-side security standards.",
  location: "India",
  availability: "Available / Open to Work",
  photo: "/file_00000000dea0720685791ec424ac1b13.png",
  handle: "santjsx",
  domain: "santhoshh.xyz"
};

export const sections: Section[] = [
  {
    key: "about",
    icon: "/icons/whitesur/finder.svg",
    title: "About",
    dockLabel: "About Me",
    color: "#FF9500", // iOS orange
    keywords: ["about", "bio", "me", "profile", "santhosh", "developer", "santjsx", "lanyard", "discord"]
  },
  {
    key: "projects",
    icon: "/icons/whitesur/gallery.svg",
    title: "Projects",
    dockLabel: "Gallery",
    color: "#34C759", // iOS green
    keywords: ["projects", "work", "portfolio", "code", "github", "apps", "hustle planner", "hybrid os", "pdf studio", "track a lot", "uno cypher"],
    data: [
      {
        name: "The Hustle Planner",
        tags: ["Next.js", "React", "Tailwind", "GSAP"],
        summary: "High-performance productivity engine featuring deep work timers, habit loops, and spatial calendar layouts designed for elite creators.",
        link: "https://the-hustle-planner.vercel.app/",
        image: "/skills_logos/project images/hustle_planner (2).png"
      },
      {
        name: "Hybrid OS",
        tags: ["React", "TypeScript", "Framer Motion", "Tailwind"],
        summary: "A web-based desktop operating system mockup complete with window management, terminal emulator, and custom interactive widgets.",
        link: "https://hybrid-os.vercel.app/",
        image: "/skills_logos/project images/Hybrid_OS.png"
      },
      {
        name: "PDF Studio",
        tags: ["Vite", "React", "PDFLib", "Tailwind"],
        summary: "A powerful, client-side PDF editing suite supporting secure annotations, document merging, page extraction, and digital signatures.",
        link: "https://pdf-studio-sable.vercel.app/",
        image: "/skills_logos/project images/pdf_studio.png"
      },
      {
        name: "Track A Lot",
        tags: ["React", "Chart.js", "Firebase", "Tailwind"],
        summary: "Intelligent personal finance tracker with automated categorization, recurring bill alerts, and interactive expense visualization.",
        link: "https://track-a-lot.vercel.app/",
        image: "/skills_logos/project images/track a lot 1.png"
      },
      {
        name: "Uno Cypher",
        tags: ["HTML5", "JavaScript", "AES-GCM", "Tailwind"],
        summary: "Zero-dependency encryption panel utilizing AES-GCM web standards to secure messages with customized key derivation.",
        link: "https://uno-cypher.vercel.app/",
        image: "/skills_logos/project images/unocypher1.png"
      }
    ]
  },
  {
    key: "skills",
    icon: "/icons/whitesur/settings.svg",
    title: "Skills",
    dockLabel: "Skills",
    color: "#007AFF", // iOS blue
    keywords: ["skills", "technologies", "frameworks", "tools", "expert", "react", "next.js", "astro", "gsap", "three.js", "webgl", "wallpaper", "desktop"],
    data: {
      "Desktop & Wallpaper": [],
      "Languages": [
        { name: "HTML5", logo: "/skills_logos/HTML5.svg" },
        { name: "CSS3", logo: "/skills_logos/CSS3.svg" },
        { name: "JavaScript", logo: "/skills_logos/JavaScript.svg" },
        { name: "TypeScript", logo: "/skills_logos/typescript.svg" }
      ],
      "Frameworks": [
        { name: "React", logo: "/skills_logos/React.svg" },
        { name: "Next.js", logo: "/skills_logos/Next.js.svg" },
        { name: "Astro", logo: "/skills_logos/astro.svg" }
      ],
      "Backend & Databases": [
        { name: "Node.js", logo: "/skills_logos/Node.js.svg" },
        { name: "Firebase", logo: "/skills_logos/Firebase.svg" },
        { name: "MongoDB", logo: "/skills_logos/MongoDB.svg" },
        { name: "Supabase", logo: "" } // Fallback to label
      ],
      "Animations & WebGL": [
        { name: "GSAP", logo: "/skills_logos/gsap.svg" },
        { name: "Three.js", logo: "/skills_logos/threedotjs.svg" },
        { name: "WebGL", logo: "/skills_logos/webgl.svg" },
        { name: "Framer Motion", logo: "/skills_logos/framer.svg" }
      ],
      "Developer Tools": [
        { name: "Git", logo: "/skills_logos/Git.svg" },
        { name: "NPM", logo: "/skills_logos/NPM.svg" },
        { name: "Vite.js", logo: "/skills_logos/Vite.js.svg" },
        { name: "VS Code", logo: "/skills_logos/Visual Studio Code (VS Code).svg" },
        { name: "Linux", logo: "/skills_logos/Linux.svg" },
        { name: "GitHub", logo: "/skills_logos/GitHub.svg" }
      ]
    }
  },
  {
    key: "experience",
    icon: "/icons/whitesur/notes.svg",
    title: "Experience",
    dockLabel: "Resume",
    color: "#5856D6", // iOS purple
    keywords: ["experience", "resume", "cv", "jobs", "history", "phases", "phase 01", "phase 02", "phase 03"],
    resumeUrl: "https://example.com/resume.pdf",
    data: [
      {
        role: "Frontend Specialization & Creative Engineering",
        org: "Phase 03",
        period: "2024 - Present",
        detail: "Specializing in visual frontend design, WebGL interactive spaces, modern Astro frameworks, and dynamic motion systems using Framer Motion and GSAP."
      },
      {
        role: "Independent Project Development & Animations",
        org: "Phase 02",
        period: "2023 - 2024",
        detail: "Shipped personal finance modules, web OS prototypes, and client-side encryption layouts. Deepened knowledge in real-time WebSockets and iTunes search synchronization integrations."
      },
      {
        role: "Core Software Development & Engineering Foundations",
        org: "Phase 01",
        period: "2021 - 2023",
        detail: "Learned vanilla Javascript algorithms, database design schemas in MongoDB/Firebase, server routing setups in Node.js, and core responsive styling standards."
      }
    ]
  },
  {
    key: "contact",
    icon: "/icons/whitesur/mail.svg",
    title: "Contact",
    dockLabel: "Contact",
    color: "#FF2D55", // iOS pink
    keywords: ["contact", "email", "linkedin", "github", "hire", "message", "instagram", "twitter"],
    data: {
      email: "heysanthoshreddy@gmail.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com/santjsx",
      twitter: "https://x.com/Santhoshh_void",
      instagram: "https://www.instagram.com/whoissanthoshh?igsh=dHljNGpqbWIwamlx",
      spotify: "https://open.spotify.com/user/21kfp472xfbt7k3cor63st63y?si=5e2343cbb22d43dd",
      discord: "santjsx"
    }
  },
  {
    key: "safari",
    icon: "/icons/whitesur/safari.svg",
    title: "Safari",
    dockLabel: "Safari",
    color: "#00A2FF",
    keywords: ["safari", "browser", "internet", "web", "google", "search"]
  },
  {
    key: "vlc",
    icon: "/icons/whitesur/vlc.svg",
    title: "VLC Player",
    dockLabel: "VLC Player",
    color: "#FF7000",
    keywords: ["vlc", "music", "lofi", "player", "soundtrack", "synth"]
  },
  {
    key: "spotify",
    icon: "/icons/whitesur/spotify.svg",
    title: "Spotify",
    dockLabel: "Spotify",
    color: "#1DB954",
    keywords: ["spotify", "music", "playlist", "songs", "profile", "santjsx"]
  },
  {
    key: "discord",
    icon: "/icons/whitesur/discord.svg",
    title: "Discord",
    dockLabel: "Discord",
    color: "#5865F2",
    keywords: ["discord", "community", "chat", "dm", "message", "handle", "santjsx"]
  },
  {
    key: "vscode",
    icon: "/icons/whitesur/vscode.svg",
    title: "VS Code",
    dockLabel: "VS Code",
    color: "#007ACC",
    keywords: ["vscode", "code", "ide", "editor", "developer", "git", "github", "santjsx"]
  }
];
