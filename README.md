# Retro Terminal Homepage

A retro terminal-style portfolio experience built with modern web technologies.

**Live Demo**: [www.8lee.ai](https://8lee.ai)

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.1.18-38B2AC)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-1.3.5-fbf0df)](https://bun.sh)

---

## Overview

Interactive portfolio simulating a classic DOS terminal. Visitors type commands to explore 64 projects, 5 education entries, and 6 volunteer roles. Features 23 visual themes, full keyboard navigation, and WCAG 2.1 AA compliance.

---

## Quick Start

**Requires [Bun](https://bun.sh) v1.3.5+** (not npm/yarn/pnpm)

```bash
git clone https://github.com/8bittts/8leeai.git
cd 8leeai
bun install
bun run dev
```

Open [http://localhost:1333](http://localhost:1333)

---

## Contributor Guide

For repository-specific workflows, testing expectations, and coding conventions, see
[AGENTS.md](AGENTS.md).

---

## Terminal Commands

| Command | Action |
|---------|--------|
| `1-64` | Open project by number |
| `65-69` | Education items |
| `70-75` | Volunteer experience |
| `help` | Show all commands |
| `theme` / `theme [name]` | List or switch themes |
| `random` | Open random project |
| `email` / `contact` | Contact info |
| `clear` / `Ctrl+L` | Reset terminal |

---

## License

MIT
