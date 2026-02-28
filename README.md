<p align="center">
  <img src="public/readme-md.png" alt="8lee.ai Terminal Portfolio" width="100%" />
</p>

<h1 align="center">Retro Terminal Portfolio</h1>

<p align="center">
  <strong>A nostalgic DOS-style terminal experience for the modern web.</strong><br/>
  Built for developers, designers, and creators who want a portfolio that stands out.
</p>

<p align="center">
  <a href="https://8lee.ai"><img src="https://img.shields.io/badge/Live_Demo-8lee.ai-00ff00?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/Get_Started-5_min_setup-ff5100?style=for-the-badge" alt="Quick Start" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-v4.2.1-38B2AC?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Bun-1.3.9-fbf0df?style=flat-square&logo=bun" alt="Bun" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

<p align="center">
  <sub>Developed with <a href="https://yen.chat">YEN</a> - the personal terminal experience</sub>
</p>

---

## Why This Exists

Most portfolios look the same. This one doesn't.

Visitors interact with your work through a **command-line interface** - typing commands, exploring projects, and discovering your story like they're hacking into a retro mainframe. It's memorable, it's fun, and it showcases your personality.

### What You Get

- **66+ project slots** - Showcase your entire body of work
- **23 color themes** - From classic green phosphor to synthwave pink
- **Terminal-style command UX** - Enter-to-load, numeric navigation, and clear shortcuts
- **WCAG 2.1 AA accessible** - Screen reader friendly
- **Mobile responsive** - Works everywhere
- **Blazing fast** - Static generation, zero client-side data fetching

---

## Quick Start

**Requires [Bun](https://bun.sh) v1.3.9+**

```bash
# Clone the repo
git clone https://github.com/8bittts/8leeai.git
cd 8leeai

# Install dependencies
bun install

# Start development server
bun run dev

# Run full validation suite
bun run check:full
```

Open [http://localhost:1333](http://localhost:1333) and start customizing.

---

## Make It Yours

### 1. Update Your Data

Edit `lib/data/portfolio.json` to add your projects, education, and experience:

```json
{
  "projects": [
    {
      "id": "my-project",
      "name": "My Project - Short Description",
      "url": "https://myproject.com",
      "linkWord": "Project"
    }
  ],
  "education": [],
  "volunteer": []
}
```

`lib/data.ts` validates this dataset at runtime and exports typed sections for the app.

### 2. Customize Themes

23 themes are included in `lib/themes/`. Create your own or modify existing ones:

| Theme | Vibe |
|-------|------|
| `terminal` | Classic green terminal |
| `8bit` | Retro pixel gaming |
| `synthwave` | 80s neon pink/cyan |
| `nord` | Cool arctic blues |
| `dracula` | Dark with vivid accents |
| `solarized` | Balanced, low-eye-strain contrast |

Switch themes with the `theme` command or `theme [name]`.

### 3. Deploy

```bash
# Build for production
bun run build

# Deploy to Vercel (recommended)
vercel --prod
```

---

## Terminal Commands

Your visitors can use these commands:

| Command | What It Does |
|---------|--------------|
| `[project #]` | Open a project by number from the Projects list |
| `[education #]` | Open an education entry by number from the Education section |
| `[volunteer #]` | Open a volunteer entry by number from the Volunteer section |
| `help` | Show all available commands |
| `email` | Show contact email |
| `education` | Show education section |
| `volunteer` | Show volunteer section |
| `github` | Open GitHub project link |
| `wellfound` | Open Wellfound profile |
| `linkedin` | Open LinkedIn profile |
| `twitter` | Open X/Twitter profile |
| `random` | Open a random project |
| `theme` | List themes or switch theme |
| `date` | Show current date/time |
| `clear` | Reset the terminal |
| `Ctrl+L` | Quick clear shortcut |
| `Cmd+K` | Quick clear shortcut (macOS) |

Common aliases:
- `themes` → `theme`
- `reset` → `clear`
- `contact`, `hello`, `reach` → `email`
- `ed`, `resume`, `cv`, `about`, `bio` → `education`
- `vol` → `volunteer`
- `li` → `linkedin`
- `x` → `twitter`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router + Turbopack) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript 5.9 (strict mode) |
| Runtime | Bun 1.3.9 |
| Linting | Biome |
| Tests | Bun smoke tests (`tests/smoke`) |
| Deployment | Vercel |

---

## Project Structure

```
app/                    Next.js App Router pages and layouts
components/             Reusable UI components
lib/
  data.ts               Typed dataset validation + exports
  data/portfolio.json   Portfolio content source of truth
  themes/               23 color theme definitions
  commands.ts           Terminal command definitions
  utils.ts              Helper functions
public/                 Static assets
```

---

## Theme Examples

<p align="center">
  <img src="public/theme-ex-1.png" alt="Theme Example 1" width="100%" />
</p>

<p align="center">
  <img src="public/theme-ex-2.png" alt="Theme Example 2" width="100%" />
</p>

<p align="center">
  <img src="public/theme-ex-3.png" alt="Theme Example 3" width="100%" />
</p>

<p align="center">
  <img src="public/theme-ex-4.png" alt="Theme Example 4" width="100%" />
</p>

<p align="center">
  <img src="public/theme-ex-5.png" alt="Theme Example 5" width="100%" />
</p>

<p align="center">
  <img src="public/theme-ex-6.png" alt="Theme Example 6" width="100%" />
</p>

---

## Contributing

This is a personal portfolio template. Fork it, make it yours. If you build something cool, I'd love to see it.

For development workflows and coding conventions, check the project's internal docs.

<p align="center">
  <img src="public/yen.png" alt="YEN Terminal" width="100%" />
</p>

<h3 align="center">Built with YEN</h3>

<p align="center">
  <a href="https://yen.chat">YEN</a> is a personal terminal experience that makes command-line work beautiful.<br/>
  Fast, customizable, and designed for developers who live in the terminal.<br/>
  <br/>
  <a href="https://yen.chat"><img src="https://img.shields.io/badge/Download-YEN-ff5100?style=for-the-badge" alt="Download YEN" /></a>
</p>

---

<p align="center">
  <strong>MIT License</strong><br/>
  <sub>Use it, modify it, ship it.</sub>
</p>
