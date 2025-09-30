# 8lee.ai

> A retro terminal-style portfolio experience built with modern web technologies

## 📄 License & Usage

This project is available under the **MIT License** - you're free to fork, modify, and use it for your own portfolio!

⚠️ **Important Privacy Notice**: This codebase is configured for **"ultra private" mode** with aggressive anti-crawling settings:
- `robots.txt` blocks all search engines and crawlers
- Security headers prevent indexing and archiving
- Metadata includes `noindex, nofollow` directives

**Before using this template, please review and update:**
- `/public/robots.txt` - Remove restrictive crawler blocking if you want SEO
- `/middleware.ts` - Adjust security headers and CORS settings for your domain
- `/app/layout.tsx` - Update metadata, robots settings, and OpenGraph data
- `/lib/data.ts` - Replace with your own portfolio content

The current settings are designed for a completely private portfolio that won't appear in search results.

[![Version](https://img.shields.io/badge/version-v1.0-green.svg)](https://github.com/8bittts/8leeai/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC)](https://tailwindcss.com)

## 🖥️ Demo

Experience the live terminal at [8lee.ai](https://8lee.ai)

## ✨ Features

- **Authentic Terminal Experience**: Complete boot sequence animation and command-line interface
- **Interactive Commands**: Navigate through 60+ projects, education, and volunteer experience
- **Typewriter Effects**: Smooth text animations with nostalgic terminal feel
- **Comprehensive Portfolio**: Professional work and achievements spanning multiple decades
- **Production Security**: CSP headers, CORS restrictions, and secure external link handling
- **Responsive Design**: Fully responsive terminal interface for all devices
- **Zero Bloat**: Pure Tailwind utilities, minimal dependencies, optimal performance
- **WCAG 2.1 AA Compliant**: Full accessibility with semantic HTML, ARIA live regions, keyboard navigation, focus indicators, and reduced motion support

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.2.23 or higher
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/8bittts/8leeai.git
cd 8leeai

# Install dependencies
bun install

# Run development server
bun run dev
```

Open [http://localhost:1333](http://localhost:1333) to view the terminal.

## 📝 Available Commands

Once the terminal loads, you can use these commands:

- `Enter` - Show more projects (pagination)
- `1-71` - Open specific project, education, or volunteer item by number
- `email` - Display contact information
- `github` - Open GitHub profile
- `wellfound` - Open Wellfound profile
- `education` - Show education background
- `volunteer` - Display volunteer experience
- `clear` - Reset terminal display

## 🛠️ Development

```bash
# Development with Turbopack
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Lint and format code
bun run check

# Clean all caches
bun run clean
```

## 🏗️ Tech Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org) with App Router & Turbopack
- **UI**: [React 19.1.1](https://react.dev) with modern hooks
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) pure utilities
- **Language**: [TypeScript](https://www.typescriptlang.org) with strict configuration
- **Runtime**: [Bun](https://bun.sh) for optimal performance
- **Code Quality**: [Biome](https://biomejs.dev) for linting and formatting
- **Security**: Production-grade middleware with CSP and CORS
- **Deployment**: [Vercel](https://vercel.com)

## 📂 Project Structure

```
8leeai/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── boot-sequence.tsx
│   ├── command-prompt.tsx
│   ├── cv-content.tsx
│   └── terminal-container.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utilities and data
├── public/             # Static assets
└── middleware.ts       # Security headers
```

## 🔒 Security

Production-ready security implementation:
- **Content Security Policy**: Strict CSP with minimal external allowlist
- **CORS**: Restrictive cross-origin policy locked to 8lee.ai
- **HSTS**: Strict transport security with preload
- **External Links**: Secure utility prevents window.opener vulnerabilities
- **Anti-Crawling**: Comprehensive robot blocking configuration
- **Headers**: XSS protection, frame options, content type options

## 📦 Version History

### v1.0 (September 29, 2025)
- **Production Release**: Terminal interface with authentic boot sequence
- **Interactive Commands**: Full command system with 60+ projects
- **Security Hardened**: Production-grade middleware and secure link handling
- **Performance Optimized**: Minimal dependencies, Turbopack, zero custom CSS
- **Comprehensive Data**: Complete portfolio with projects, education, and volunteer experience
- **Audio Integration**: Subtle sound effects for enhanced immersion
- **Full Accessibility**: WCAG 2.1 AA compliant with semantic HTML, ARIA support, and keyboard navigation

## 📄 License

© 2025 Eight Lee. All rights reserved.

## 🤝 Contributing

This is a personal portfolio project. While not open for contributions, feel free to fork and adapt for your own use.

## 📧 Contact

For inquiries, use the `email` command in the terminal or visit [8lee.ai](https://8lee.ai)

---

Built with ❤️ using modern web technologies for a retro experience

Follow [@8BIT](https://x.com/8BIT) on X

Check out [DeathNote](https://deathnote.ai) - 8BIT's latest project
