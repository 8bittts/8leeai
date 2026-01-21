# Terminal Setup Documentation

**This document captures the complete local terminal configuration for reproducibility.**

Last updated: 2026-01-20

---

## Quick Setup (New Machine)

```bash
# 1. Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install all tools (copy entire block)
brew install \
  ripgrep fd bat eza git-delta fzf zoxide starship btop lazygit trash tldr jq \
  atuin dust duf procs sd choose hyperfine tokei glow doggo gping

# 3. Copy ~/.zshrc from this document
# 4. Copy ~/.config/starship.toml from this document
# 5. Copy ~/.config/ghostty/config from this document (YEN.app uses Ghostty config)
# 6. Initialize tools
atuin init
mkdir -p ~/.zsh/cache
```

---

## System Information

| Component | Value |
|-----------|-------|
| OS | macOS 26.2 (Darwin 25.2.0) |
| Architecture | ARM64 (Apple Silicon) |
| Shell | zsh 5.9 |
| Terminal | [YEN.app](https://yen.chat) (Ghostty-based) |
| Package Manager | Homebrew 5.0.10 |

## Runtimes

| Runtime | Version |
|---------|---------|
| Node.js | v25.3.0 |
| Bun | 1.3.6 |
| Go | 1.25.5 |
| Python | 3.14.2 |
| Deno | 2.6.5 |

---

## Installed Homebrew Formulas (185 total)

### Core Modern CLI Tools

| Tool | Replaces | Description | Install |
|------|----------|-------------|---------|
| `ripgrep` (rg) | grep | Fast regex search | `brew install ripgrep` |
| `fd` | find | Fast file finder | `brew install fd` |
| `bat` | cat/less | Syntax-highlighted cat | `brew install bat` |
| `eza` | ls | Modern ls with icons | `brew install eza` |
| `git-delta` | diff | Beautiful git diffs | `brew install git-delta` |
| `fzf` | ctrl-r | Fuzzy finder | `brew install fzf` |
| `zoxide` | cd | Smart directory jumper | `brew install zoxide` |
| `btop` | top/htop | Resource monitor | `brew install btop` |
| `lazygit` | git CLI | Git TUI | `brew install lazygit` |
| `trash` | rm | Safe delete to trash | `brew install trash` |
| `starship` | PS1 | Cross-shell prompt | `brew install starship` |
| `tldr` | man | Simplified man pages | `brew install tldr` |
| `jq` | - | JSON processor | `brew install jq` |

### Recommended Additions

| Tool | Replaces | Description | Install |
|------|----------|-------------|---------|
| `atuin` | history | SQLite shell history | `brew install atuin` |
| `dust` | du | Visual disk usage | `brew install dust` |
| `duf` | df | Disk free viewer | `brew install duf` |
| `procs` | ps | Process viewer | `brew install procs` |
| `sd` | sed | Simple find/replace | `brew install sd` |
| `choose` | cut/awk | Field selector | `brew install choose` |
| `hyperfine` | time | Benchmarking | `brew install hyperfine` |
| `tokei` | cloc | Code statistics | `brew install tokei` |
| `glow` | - | Markdown renderer | `brew install glow` |
| `doggo` | dig | DNS lookup | `brew install doggo` |
| `gping` | ping | Ping with graph | `brew install gping` |

### Development Tools

```
bun deno docker gh git-lfs go node pyenv python@3.14 uv zig
```

### Media/Graphics

```
ffmpeg imagemagick graphicsmagick tesseract yt-dlp
```

### Databases

```
postgresql@14 supabase dolt
```

### Cloud/Infra

```
docker gcloud
```

---

## Configuration Files

### ~/.zshrc

```bash
# ============================================================
# ZSH Configuration - eight's Terminal Setup
# ============================================================
# Fix: Suppress Claude Code's shopt calls in zsh (shopt is bash-only)
shopt() { : ; }

# ============================================================
# PATH Configuration
# ============================================================
export PATH="/opt/homebrew/bin:$PATH"
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
export PATH="$PATH:/Applications/010 Editor.app/Contents/CmdLine"
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"

# Bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
[ -s "/Users/eight/.bun/_bun" ] && source "/Users/eight/.bun/_bun"

# Google Cloud SDK
if [ -f "$HOME/google-cloud-sdk/path.zsh.inc" ]; then
  . "$HOME/google-cloud-sdk/path.zsh.inc"
fi

# YEN CLI
export PATH="/Applications/YEN.app/Contents/Resources/bin:$PATH"
yen() { command yen "$@"; }

# ============================================================
# Completions
# ============================================================
# Docker completions
fpath=($HOME/.docker/completions $fpath)

# Cached compinit (faster startup)
autoload -Uz compinit
if [[ -n ${ZDOTDIR:-$HOME}/.zcompdump(#qN.mh+24) ]]; then
  compinit
else
  compinit -C
fi

# Completion settings
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'
zstyle ':completion:*' accept-exact '*(N)'
zstyle ':completion:*' use-cache on
zstyle ':completion:*' cache-path ~/.zsh/cache

# ============================================================
# Modern CLI Tools Initialization
# ============================================================
# Starship prompt
eval "$(starship init zsh)"

# Zoxide (smart cd)
eval "$(zoxide init zsh)"

# fzf integration
source <(fzf --zsh)

# Atuin (shell history) - AFTER fzf to override ctrl-r
eval "$(atuin init zsh)"

# ============================================================
# Aliases - Modern Replacements
# ============================================================
# File listing (eza)
alias ls="eza --icons=auto"
alias ll="eza -l --icons=auto --git"
alias la="eza -la --icons=auto --git"
alias lt="eza --tree --level=2 --icons=auto"
alias tree="eza --tree --icons=auto"

# File viewing (bat)
alias cat="bat --paging=never"
alias less="bat"

# Search (ripgrep, fd)
alias grep="rg"
alias find="fd"

# System monitoring
alias top="btop"
alias ps="procs"
alias du="dust"
alias df="duf"

# Text processing
alias diff="delta"
alias sed="sd"

# DNS
alias dig="doggo"

# Git
alias lg="lazygit"

# Safe operations
alias rm="trash"

# Navigation
alias ..="cd .."
alias ...="cd ../.."
alias c="clear"
alias h="history"
alias p="pwd"

# YEN shortcuts
alias weather="yen weather"
alias g="yen g"
alias email="yen email"

# ============================================================
# Environment Variables
# ============================================================
# Pagers
export PAGER="bat"
export MANPAGER="sh -c 'col -bx | bat -l man -p'"

# Editor
export EDITOR="vim"

# fzf defaults (use fd for finding)
export FZF_DEFAULT_COMMAND="fd --type f --hidden --follow --exclude .git"
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND="fd --type d --hidden --follow --exclude .git"

# fzf appearance and preview
export FZF_DEFAULT_OPTS="
  --height=40%
  --layout=reverse
  --border=rounded
  --preview-window=right:60%:wrap
  --bind='ctrl-/:toggle-preview'
"
export FZF_CTRL_T_OPTS="--preview 'bat --color=always --style=numbers --line-range=:500 {}'"
export FZF_ALT_C_OPTS="--preview 'eza --tree --level=2 --icons=auto --color=always {}'"

# ============================================================
# Functions
# ============================================================
# Command not found handler (YEN)
command_not_found_handler() {
  local suggestion
  suggestion=$(yen suggest "$1" 2>/dev/null)
  if [[ -n "$suggestion" && "$suggestion" != "No"* ]]; then
    echo "yen: command not found: $1"
    echo "Did you mean: yen $suggestion"
    return 127
  fi
  echo "zsh: command not found: $1"
  return 127
}

# Create directory and cd into it
mkcd() { mkdir -p "$1" && cd "$1"; }

# Extract any archive
extract() {
  if [ -f "$1" ]; then
    case "$1" in
      *.tar.bz2) tar xjf "$1" ;;
      *.tar.gz)  tar xzf "$1" ;;
      *.tar.xz)  tar xJf "$1" ;;
      *.zip)     unzip "$1" ;;
      *.gz)      gunzip "$1" ;;
      *.7z)      7z x "$1" ;;
      *) echo "Unknown archive format: $1" ;;
    esac
  fi
}

# fzf file preview and edit
fzp() { fzf --preview 'bat --color=always {}' | xargs -r $EDITOR; }

# Quick git status
gs() { git status -sb; }
```

### ~/.config/starship.toml

```toml
# Minimal starship prompt
format = """
$directory\
$git_branch\
$git_status\
$character"""

[directory]
truncation_length = 3
truncate_to_repo = true
style = "blue"

[git_branch]
format = "[$branch]($style) "
style = "purple"

[git_status]
format = '[$all_status$ahead_behind]($style) '
style = "red"
ahead = "+"
behind = "-"
diverged = "+-"
modified = "*"
staged = "+"
untracked = "?"

[character]
success_symbol = "[>](green)"
error_symbol = "[>](red)"
```

### ~/.config/ghostty/config (YEN.app Terminal)

YEN.app (https://yen.chat) uses Ghostty under the hood. Config location: `~/.config/ghostty/config`

```ini
# YEN Default Branding Styles

# Cursor
cursor-color = #ff5100
cursor-opacity = 1.0
cursor-style = block
cursor-text = #ffffff

# Selection
selection-background = #ff5100
selection-foreground = #ffffff

# Background and Foreground
background = #1a1a1a
foreground = #e0e0e0

# Standard Colors (0-7)
palette = 0=#000000
palette = 1=#ff5555
palette = 2=#50fa7b
palette = 3=#f1fa8c
palette = 4=#bd93f9
palette = 5=#ff79c6
palette = 6=#8be9fd
palette = 7=#bbbbbb

# Bright Colors (8-15)
palette = 8=#555555
palette = 9=#ff5555
palette = 10=#50fa7b
palette = 11=#f1fa8c
palette = 12=#bd93f9
palette = 13=#ff79c6
palette = 14=#8be9fd
palette = 15=#ffffff

# Extended Colors (16-21) - YEN Brand Orange Spectrum
palette = 16=#ff5100
palette = 17=#ff6a1f
palette = 18=#ff833d
palette = 19=#ff9c5c
palette = 20=#ffb57a
palette = 21=#ffce99

# Window
window-padding-x = 4
window-padding-y = 4
window-padding-balance = true

# Font
font-size = 14
font-thicken = true
```

---

## Tool-Specific Notes

### Atuin (Shell History)

```bash
# First-time setup
atuin init
atuin import auto  # Import existing history

# Optional: Enable sync (requires account)
atuin register -u <username> -e <email>
atuin login -u <username>
atuin sync
```

### Zoxide (Smart cd)

```bash
# Usage
z foo      # Jump to directory matching "foo"
zi foo     # Interactive selection with fzf
z -        # Go to previous directory
```

### fzf Keybindings

| Key | Action |
|-----|--------|
| `Ctrl+T` | Find files |
| `Ctrl+R` | Search history (overridden by atuin) |
| `Alt+C` | Change directory |
| `Ctrl+/` | Toggle preview (custom) |

### Lazygit

```bash
lg  # Launch lazygit in current repo
```

---

## Compatibility Notes

1. **alias grep=rg**: Some scripts expect GNU grep. Use `command grep` for compatibility
2. **alias sed=sd**: sd has different syntax (`sd 'find' 'replace' file`). Use `command sed` for traditional sed
3. **alias find=fd**: fd syntax differs. Use `command find` for POSIX find
4. **compinit caching**: 24-hour cache means new completions appear after restart

---

## Verification Commands

```bash
# Check all tools are installed
command -v rg fd bat eza delta fzf zoxide starship btop lazygit trash jq tldr atuin dust duf procs

# Check shell integrations
echo $STARSHIP_SHELL    # Should show "zsh"
zoxide query --list     # Should show visited directories
atuin stats             # Should show history stats

# Test aliases
type ls                 # Should show "ls is an alias for eza..."
type cat                # Should show "cat is an alias for bat..."
```

---

## Troubleshooting

### Slow Shell Startup

```bash
# Profile startup time
time zsh -i -c exit

# Check what's slow
zmodload zsh/zprof
# ... at end of .zshrc add: zprof
```

### Icons Not Showing

Install a Nerd Font:
```bash
brew tap homebrew/cask-fonts
brew install font-jetbrains-mono-nerd-font
```

Then set it in YEN/Ghostty config (`~/.config/ghostty/config`):
```ini
font-family = JetBrainsMono Nerd Font
```

### Atuin Not Working

```bash
# Re-initialize
atuin init zsh > ~/.config/atuin/init.zsh
source ~/.config/atuin/init.zsh
```
