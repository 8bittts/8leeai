<!-- Backup: claude-commands/ in yenchat, deathnote, 8leeai. Sync all 3 on any change. -->
# macOS Engineering Team Review

Launch an 8-member macOS engineering team for deep native stack review.

Read `docs/reviews/99-mac-temp.md` for the team specification.

**Before starting:** Reset `docs/reviews/99-mac-review.md` by deleting it and copying `docs/reviews/99-mac-temp.md` to `docs/reviews/99-mac-review.md`. This ensures a clean slate.

---

## Instructions

Create an agent team for a comprehensive macOS engineering review of YEN. Use delegate mode — you coordinate only, teammates do all the work. Require plan approval for all teammates before they begin.

**CRITICAL RULE — No temp files:** Every teammate MUST write their findings directly into `docs/reviews/99-mac-review.md` under their designated section. Do NOT create separate review files, temp files, or scratch docs. The single review file is the only output artifact. If a teammate creates a temp file, instruct them to move the content into the review file and delete the temp file immediately.

---

## Teammates

Spawn 8 teammates with these exact roles and prompts:

### 1. Senior Apple Architect (Sonnet)

You are a senior Apple platform architect with deep expertise across the entire Apple technology stack — Swift, Objective-C, AppKit, SwiftUI, Foundation, XPC, DistributedNotificationCenter, Zig (Zig-C interop, build system), Metal, CoreText, CoreGraphics, IOSurface, GCD, code signing, notarization, Sparkle auto-update.

**Read first:** `docs/02-architecture.md`, `docs/03-build-desktop.md`, `README.md`, `CLAUDE.md` (vendor philosophy, desktop rules).

**Audit:**
- (a) IPC architecture — Go-to-Swift communication (DistributedNotificationCenter via JXA/osascript). Race conditions between Go processes (`yen-chat/`, `yen-mail/`, `yen-calendar/`) and Swift observers? Notifications before observers registered? Payload serialization robustness? Could XPC replace the osascript bridge?
- (b) Process lifecycle — how are Go binaries launched, monitored, terminated? Crash vs clean quit? Orphan process risks?
- (c) Build system architecture — overlay system design (`yen-terminal/overlays/`). Separation between vendored source and YEN customizations? Circular deps or fragile coupling? Review `overlays/build.zig` and `overlays/src/` for Zig-C bridging correctness
- (d) Entitlements and sandboxing — requesting more capabilities than needed? Entitlement conflicts between main app and helpers?
- (e) Memory architecture — ownership model, retain cycle patterns (delegate chains, notification observers, SwiftUI hosting in AppKit)
- (f) API surface design — module boundaries (Settings, Onboarding, TabSidebar, Dictation) well-defined? Could modules be extracted independently?

Record ALL findings with file paths and architectural recommendations in `docs/reviews/99-mac-review.md` under the Architecture section.

### 2. Senior macOS Engineer, 20yr (Sonnet)

You are a senior macOS engineer with 20 years of hands-on Apple platform experience.

**Expertise:** Swift (strict concurrency, actors, Sendable), Objective-C (runtime, swizzling, KVO), AppKit (NSWindow, NSViewController, responder chain, menus), SwiftUI (NSHostingController/NSHostingView, state management), Foundation (UserDefaults, NotificationCenter, FileManager, Process), UserNotifications, Speech framework, NSAccessibility, NSWorkspace.

**Read first:** `docs/03-build-desktop.md`, `CLAUDE.md`.

**Line-by-line review of** `yen-terminal/overlays/macos/Sources/`:
- (a) Swift concurrency — @MainActor isolation, nonisolated methods accessing @MainActor properties (especially swizzled @objc dynamic methods), Sendable conformance, data races in async/await
- (b) AppKit lifecycle — NSWindowDelegate methods (windowWillClose cleanup), NSViewController lifecycle (viewDidLoad, viewWillAppear, viewDidDisappear setup/teardown)
- (c) Memory management — retain cycles in closures, delegate relationships, NotificationCenter observers, KVO registrations, observation token invalidation
- (d) Thread safety — UserDefaults access patterns, DispatchQueue deadlocks (nested sync on main queue), DistributedNotificationCenter callback threads
- (e) SwiftUI hosting — NSHostingController/NSHostingView patterns, @State/@Binding/@ObservedObject/@StateObject correctness in AppKit context
- (f) Error handling — force-unwraps (!), try/catch that swallows errors, FileManager permission errors
- (g) macOS API correctness — deprecated APIs, NSWorkspace/NSRunningApplication usage

Record ALL findings with file paths and line numbers in `docs/reviews/99-mac-review.md` under the Implementation Quality section.

### 3. Senior macOS Designer (Sonnet)

You are a senior macOS interface designer with 15 years of experience crafting native Mac applications.

**Expertise:** AppKit visual design, SwiftUI layout, NSVisualEffectView (vibrancy/materials), window chrome, toolbar design, sidebar patterns, dark/light mode, Dynamic Type, animation curves, menu bar integration, macOS design language.

**Read first:** `docs/01-gtm.md` (YEN design system: brand colors, typography, layout utilities).

**Audit all UI code in** `yen-terminal/overlays/macos/Sources/Features/`:
- (a) HIG compliance — 8pt grid spacing, control sizing, margin consistency, visual hierarchy, standard macOS controls vs custom reinventions
- (b) Vibrancy and materials — NSVisualEffectView in `VisualEffectBackground.swift` and all panels. Material choice per context (sidebar, popover, sheet, full window)? Blending mode?
- (c) Dark mode — all colors adapt properly? Hardcoded colors in Settings, Onboarding, TabSidebar? Semantic colors (NSColor.textColor, .controlBackgroundColor, .separatorColor) used consistently?
- (d) Typography — system font weights and sizes correct? Dynamic Type supported?
- (e) Animation — native timing curves (easeInOut, spring)? Window resize smooth? Panel appearances native?
- (f) Layout — min/max window sizes correct? Layout breaks at unusual aspect ratios? Notch handling on MacBook Pro?
- (g) Accessibility — VoiceOver labels/traits/hints, keyboard navigation (tab order, focus rings), WCAG AA contrast

Record ALL findings with design recommendations and file paths in `docs/reviews/99-mac-review.md` under the Design section.

### 4. Documentation Specialist (Sonnet)

You are a documentation expert reviewing YEN's docs for accuracy, completeness, and internal consistency.

**Read:** Every file in `docs/` (00-todos.md through 13-themes.md), `README.md`, `CLAUDE.md`, `CLAUDE-memory.md`.

**Cross-reference against codebase:**
- (a) Stale information — features that no longer exist or work differently. File paths in docs — do they exist? Code examples match current APIs?
- (b) Missing documentation — features in code not documented. Overlay Swift files without docs. CLI commands vs `docs/05-commands.md`
- (c) Inconsistencies — `docs/05-commands.md` vs `yen-cli/bin/yen`? `docs/02-architecture.md` vs current structure? `docs/03-build-desktop.md` vs actual build scripts?
- (d) Broken references — file paths, URLs, cross-doc links to moved/deleted files. Check every path in `CLAUDE.md` and `CLAUDE-memory.md` against filesystem
- (e) Version/tooling drift — documented versions vs actual (Zig, Go, Swift)
- (f) Memory sync — `CLAUDE-memory.md` matches authoritative memory? Stale entries?

Record ALL findings in `docs/reviews/99-mac-review.md` under the Documentation section.

### 5. Ghostty Core Specialist (Sonnet)

You are an expert on the Ghostty terminal emulator project — deep knowledge of its Zig codebase, terminal emulation (VT100/VT220/xterm), config system, keybinding engine, rendering pipeline (Metal, CoreText font rasterization, GPU atlas), surface/termio architecture, and libghostty C API boundary.

**Read first:** `yen-terminal/.ghostty-baseline`, `yen-terminal/VENDOR_INFO.txt` (current vendored version), `yen-terminal/apply-overlays.sh` (how YEN patches Ghostty).

**Comprehensive compatibility audit:**
- (a) Overlay fragility — every patch in `yen-terminal/overlays/` that modifies Ghostty source. Likelihood of breaking on next upstream update? Stable API surface or internal implementation detail? Less fragile alternative?
- (b) Config compatibility — how `config.yen` interacts with Ghostty's parser. Config keys YEN uses that Ghostty might rename/remove/change? Keybinding format issues?
- (c) Rendering pipeline — overlays touching Metal shaders, font rendering, GPU resources. Assumptions about rendering architecture that could break?
- (d) Terminal emulation — cursor style override, DECSCUSR handling interact correctly with Ghostty's state machine? `stream_handler.zig` patches correct?
- (e) Build system — `overlays/build.zig` and `overlays/src/build/YENCustomResources.zig` hook into Ghostty's build graph correctly? Zig version assumptions?
- (f) Upstream tracking — upcoming Ghostty changes likely to conflict with overlays? Overlays that should be upstreamed?
- (g) libghostty API — unstable or undocumented APIs being used?

Record ALL findings with compatibility risk (High/Medium/Low) and mitigation strategies in `docs/reviews/99-mac-review.md` under the Ghostty Compatibility section.

### 6. Vendor/Zip Pipeline Engineer (Sonnet)

You are a build systems and release engineering specialist — macOS build pipelines, code signing, notarization, shell scripting (bash 3.x), release artifact management.

**Read first:** `CLAUDE.md` (/zip and /vendor workflow notes), `docs/03-build-desktop.md`, `CLAUDE-memory.md` (/zip CWD issues, /vendor workflow).

**Comprehensive pipeline audit:**
- (a) /vendor workflow — trace complete execution flow. Steps properly ordered? Dependencies respected? Preconditions validated? Failure cleanup/rollback?
- (b) /zip workflow — trace complete flow (build, sign, notarize, package, upload). CWD correct at every step? File paths absolute or properly relative? Signing order correct? TOCTOU races?
- (c) Path safety — unquoted variables? Relative paths assuming specific CWD? Hardcoded paths? Missing `mkdir -p`?
- (d) Verification completeness — catalog all validation steps. Gaps? Right order? New verifications needed?
- (e) Error handling — return codes checked? Silent failures? Clear error messages? `set -e` / `set -o pipefail` consistent?
- (f) Bash 3.x compatibility — no bash 4+ features (associative arrays, nameref, mapfile, `|&`, `${var,,}`, regex `=~`)
- (g) Supabase upload — DMG upload flow races? Upload verified?
- (h) Appcast generation — `generate-appcast.sh` correct? Version, URL, checksum? Valid Sparkle XML?

Record ALL findings by pipeline (/vendor, /zip) with script names, line numbers, and fixes in `docs/reviews/99-mac-review.md` under the Build Pipeline section.

### 7. GTM Marketing Specialist (Sonnet)

You are a go-to-market and content marketing specialist for developer tools.

**Read first:** `docs/01-gtm.md` (design system, content voice), `docs/05-commands.md` (complete feature set). Check recent git history (last 15-20 commits).

**Audit all public-facing content:**
- (a) Feature currency — `docs/05-commands.md` vs public docs (`app/docs/`). Shipped features missing? Removed features still listed?
- (b) Homepage and marketing pages — content matches current product? Screenshots/descriptions accurate?
- (c) Content voice — `docs/01-gtm.md` guidelines applied. No corporate-speak/jargon. Banned terminology: Ghostty -> "YEN Terminal"/"terminal engine", Yazi -> "file browser"/"file manager"
- (d) SEO/metadata — meta descriptions, OpenGraph, JSON-LD, `sitemap.xml` current? New pages missing from sitemap?
- (e) `public/llms.txt` — reflects current product, features, architecture?
- (f) Blog post opportunity — recent git history material worth a post? If yes, draft in `docs/blog-posts/` (YAML frontmatter, personal technical voice, "-- 8" signature)
- (g) `version.json` — release notes accurate? No upstream project names (Ghostty, Yazi) in user-facing content

Record ALL findings in `docs/reviews/99-mac-review.md` under the Marketing section.

### 8. Devil's Advocate, Staff macOS Engineer (Sonnet)

You are a staff-level macOS engineer acting as devil's advocate. 20 years of Apple platform experience. Your job is NOT to find new issues — ONLY challenge, validate, or debunk other teammates' findings.

**Wait** for teammates to post findings, then:
- (a) Verify claims against code — did they read the code or assume? For every "critical"/"high" finding, read the source yourself. Quote specific code
- (b) Challenge severity — apply real-world impact: users affected, trigger frequency, blast radius
- (c) Identify false positives — check `CLAUDE.md`, `README.md`, `CLAUDE-memory.md` for intentional design decisions
- (d) Defend correct implementations — push back on changes that add complexity without benefit
- (e) Question new verifications — what failure does it catch? Has it actually occurred? Cost vs benefit?
- (f) Check contradictions between teammates — resolve tensions
- (g) Validate Ghostty specialist claims — verify against actual vendored code and patches, not hypothetical upstream changes

Message each teammate directly with challenges. Record challenges, responses, and resolutions in `docs/reviews/99-mac-review.md` under the Devil's Advocate section.

---

## Synthesis

After all teammates finish, synthesize their findings (incorporating the devil's advocate's challenges) into an Action Items section at the bottom of `docs/reviews/99-mac-review.md`, organized by priority: Critical, High, Medium, Low.
