# Portfolio Improvements - Master Plan

**Status:** Command Aliases Complete ✅
**Last Updated:** November 20, 2025

---

## Completed Improvements

### 1. Command Aliases ✅ COMPLETE

**Natural language command support for better discoverability.**

**Implemented Aliases:**
```typescript
// Education aliases
'resume', 'cv', 'about', 'bio' → education

// Contact aliases
'contact', 'reach', 'hello' → email

// Social links command
'social' → Shows all social/professional links at once
```

**Files Modified:**
- `lib/utils.ts` - Added 7 new commands to VALID_COMMANDS
- `components/command-prompt.tsx` - Added normalizeCommand() helper, social handler
- `README.md` - Updated Available Commands section

**Benefit:** More intuitive, matches natural user language patterns

---

## Important Context: Clear Behavior

**Current Implementation:**
```typescript
// In terminal-container.tsx
const clearToStart = () => {
  setBootComplete(false)       // Returns to boot screen
  setVisibleProjects(PROJECTS_PER_PAGE)
  setCommand("")
  setTimeout(() => setBootComplete(true), 100)
}
```

**What This Means:**
- `clear` command and `Ctrl+L`/`Cmd+K` return user to boot screen
- NOT just clearing terminal (like standard terminals)
- Everything resets: projects, sections, state
- User sees boot animation again (but can skip)

**Impact on Future Improvements:**
- Command counter would reset on every clear (not persistent like bash)
- Boot time display would show repeatedly
- History would need localStorage to persist across clears

**Two Options:**
1. Keep current behavior, skip improvements that conflict
2. Change clear to just hide content, add separate "reboot" command

---

## Next Priority Improvements

### 2. Easter Egg Commands (20 minutes) ⚠️ Ready

**Classic Unix commands with personality.**

**New Commands:**
```typescript
// whoami
"You're exploring Eight Lee's portfolio terminal"
"Type 'help' to see what I can do!"

// uname
"8leeOS v[age] (Terminal Edition)"
"Built with Next.js 16.0.3 + React 19.2.0"

// date
new Date().toString() // Current date/time

// echo [text]
// Simply echoes back what user types

// fortune
// Random rotating messages about portfolio
[
  "Did you know? Eight has worked with AI/ML for 3+ years",
  "Fun fact: This terminal is built with pure Tailwind utilities",
  "Tip: Try the 'random' command to discover a random project",
  "Secret: Type numbers 1-64 to jump directly to any project",
]
```

**Implementation Location:** `components/command-prompt.tsx`

**Benefits:** Fun personality, discovery factor, terminal authenticity

---

### 3. Stats Command (25 minutes) ⚠️ Ready

**Portfolio metrics at a glance.**

**Output Format:**
```
Portfolio Statistics
══════════════════════════════════════
Total Projects:        64
Education Entries:      5
Volunteer Roles:        6
Available Commands:    20+
Technologies:          React, Next.js, TypeScript, AI/ML,
                      Tailwind CSS, Node.js, Python
Years Active:          20+ years
Latest Project:        [most recent project name]
Most Popular:          AI/ML, Full-Stack Web
```

**Benefits:** Useful overview, showcases breadth of experience

---

### 4. Sound Toggle (10 minutes) ⚠️ Ready

**User control over boot audio.**

**Commands:**
```typescript
'sound on'   // Enable boot audio (default)
'sound off'  // Disable boot audio
'sound'      // Show current status
```

**Implementation:**
- Add to localStorage for persistence
- Check on boot before playing audio
- Update status message to reflect state

---

### 5. Command History Display (25 minutes) ⚠️ Ready

**Show past commands.**

**Command:** `history`

**Output:**
```
Command History
══════════════════════════════════════
1. help
2. education
3. github
4. random
5. 42

Type any number to execute that command again
```

**Implementation Options:**
- Store in component state (resets on clear)
- Store in localStorage (persists across clears)

---

## Improvements Requiring Clear Behavior Change

These would work better if `clear` just hid content instead of returning to boot:

### Command Counter in Prompt ⏸️ DEFERRED

**What:** Change prompt from `$:` to `[1] $:`, `[2] $:`, etc.

**Conflict:** Counter would reset to 1 on every clear (not like real terminals)

**Solutions:**
- Use localStorage for persistence (but feels wrong if clear returns to boot)
- Change clear behavior to just hide content
- Skip this improvement

---

### Boot Time Display ⏸️ DEFERRED

**What:** Show actual boot sequence duration

**Conflict:** Would display every time user clears (every return to boot)

**Solutions:**
- Only show on first boot of session (add isFirstBoot tracking)
- Change clear behavior
- Skip this improvement

---

## Implementation Guidelines

**Quality Standards:**
- All code includes concise, useful comments
- Maintain TypeScript strict mode
- Pass Biome linting (100+ error rules)
- Use only Tailwind utilities
- No breaking changes
- Backward compatible
- Test all new commands

**Testing Checklist:**
- Verify all new commands work correctly
- Test with and without leading slash
- Check help text displays properly
- Ensure status messages are accurate
- Validate error handling for edge cases

---

## Completed Checklist

- ✅ Command Aliases (7 new commands)
- ✅ TypeScript compilation passes
- ✅ Biome linting passes
- ✅ README.md updated
- ✅ Help section updated
- ⏹️ Easter Egg Commands
- ⏹️ Stats Command
- ⏹️ Sound Toggle
- ⏹️ Command History

---

**Total Time Estimate for Remaining Items:** ~80 minutes (4 improvements)
