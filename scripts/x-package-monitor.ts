#!/usr/bin/env bun

/**
 * Package Update Monitor Agent - Bun Native TypeScript Edition
 *
 * ============================================================
 * RUN THIS SCRIPT WITH ONE OF THESE COMMANDS:
 * ============================================================
 * bun run packages              # Check all packages (recommended)
 * bun run packages:watch        # Continuous monitoring (every 6 hours)
 * bun run packages:critical     # Critical/security updates only
 *
 * Or directly:
 * bun scripts/x-package-monitor.ts
 * bun scripts/x-package-monitor.ts --watch
 * bun scripts/x-package-monitor.ts --critical
 * bun scripts/x-package-monitor.ts --verify    # Run with verification checks
 * ============================================================
 *
 * Monitors library and package updates, analyzes breaking changes,
 * and provides impact-based recommendations for updates.
 *
 * CRITICAL IMPLEMENTATION NOTES:
 * ==============================
 * 1. Parser (parseBunOutdated):
 *    - Parses TABLE FORMAT from `bun outdated` command (NOT arrow format)
 *    - Table columns: | Package | Current | Update | Latest |
 *    - Must handle scoped packages (@org/pkg) and (dev) suffix
 *    - Regex: /^\|\s*(@?[\w-/@.]+)(?:\s+\(dev\))?\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|/
 *    - Only includes updates where latest !== current
 *
 * 2. Priority Classification (calculatePriority):
 *    - MUST use EXACT package name matching, NOT includes()
 *    - Prevents misclassification (e.g., @testing-library/react as HIGH)
 *    - Current tiers: HIGH (core), MEDIUM (build-time), LOW (dev-only)
 *
 * 3. Breaking Changes Database (loadBreakingChangesDB):
 *    - MUST include entries for ALL packages in package.json
 *    - Organized by category: Production Deps, Dev Deps (Build/Style, Linting, Testing, Types)
 *    - Each entry: { breaking: [...], impact: "high|medium|low", effort: "high|medium|low" }
 *
 * Automatic cleanup:
 *   - Removes generated .md file after simple/safe updates
 *   - Keeps .md file for complex updates (CAUTION/URGENT) requiring review
 *   - Cleans up old plan files when all packages are up to date
 *
 * REQUIRED - After Installing Updates:
 * =====================================
 * 1. Update CLAUDE.md Tech Stack section
 * 2. Update README.md badges and Tech Stack section
 * 3. Update docs/release-notes/YYYY-MM-wN-month.md
 * 4. Git commit with descriptive message
 */

// Types
interface PackageJson {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface MonitorConfig {
  exclusions?: {
    packages?: string[]
    reasons?: Record<string, string>
  }
}

interface BreakingChangeInfo {
  breaking: string[]
  impact: "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
}

type BreakingChangesDB = Record<string, Record<string, BreakingChangeInfo>>

interface PackageUpdate {
  name: string
  current: string
  latest: string
  type: string
}

interface AnalyzedUpdate extends PackageUpdate {
  priority: "critical" | "high" | "medium" | "low"
  breakingChanges: string[]
  impact: "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
  hasSecurity: boolean
  recommendation: "urgent" | "caution" | "safe"
}

interface ActionPlan {
  urgent: AnalyzedUpdate[]
  caution: AnalyzedUpdate[]
  safe: AnalyzedUpdate[]
}

interface MonitorOptions {
  watch?: boolean
  critical?: boolean
  verify?: boolean
}

// Colors for terminal output
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
} as const

class PackageMonitorAgent {
  private criticalOnly: boolean
  private runVerify: boolean
  private generatedPlanFile: string | null = null
  private knownBreakingChanges: BreakingChangesDB
  private excludedPackages: Set<string> = new Set()

  constructor(options: MonitorOptions = {}) {
    this.criticalOnly = options.critical ?? false
    this.runVerify = options.verify ?? false
    this.loadPackageJson() // Validate package.json exists
    this.knownBreakingChanges = this.loadBreakingChangesDB()
  }

  private loadPackageJson(): PackageJson {
    try {
      const fs = require("node:fs")
      const content = fs.readFileSync("package.json", "utf8")
      return JSON.parse(content) as PackageJson
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`${COLORS.red}[ERROR] Failed to load package.json:${COLORS.reset}`, message)
      process.exit(1)
    }
  }

  private loadBreakingChangesDB(): BreakingChangesDB {
    // Load exclusions configuration
    try {
      const content = require("node:fs").readFileSync(".package-monitor-config.json", "utf8")
      const config = JSON.parse(content) as MonitorConfig
      this.excludedPackages = new Set(config.exclusions?.packages ?? [])
    } catch {
      // No config file - no exclusions
      this.excludedPackages = new Set()
    }

    // Breaking Changes Database
    // MUST include ALL packages from package.json
    return {
      // Production Dependencies - Core Framework
      next: {
        "17.0.0": {
          breaking: ["Potential App Router changes", "Node.js version requirements"],
          impact: "high",
          effort: "high",
        },
        "16.0.0": {
          breaking: ["App Router updates", "Turbopack improvements", "React 19 support"],
          impact: "medium",
          effort: "low",
        },
      },
      react: {
        "20.0.0": {
          breaking: ["Potential concurrent features changes", "Hook behavior updates"],
          impact: "high",
          effort: "high",
        },
        "19.0.0": {
          breaking: [
            "Concurrent features stable",
            "useEffect timing changes",
            "Strict mode behavior",
          ],
          impact: "medium",
          effort: "medium",
        },
      },
      "react-dom": {
        "20.0.0": {
          breaking: ["Hydration changes", "Server rendering updates"],
          impact: "high",
          effort: "high",
        },
        "19.0.0": {
          breaking: ["Concurrent features", "Hydration improvements"],
          impact: "medium",
          effort: "medium",
        },
      },

      // Production Dependencies - Vercel Services
      "@vercel/analytics": {
        "2.0.0": {
          breaking: ["API changes", "Configuration updates"],
          impact: "low",
          effort: "low",
        },
      },
      "@vercel/speed-insights": {
        "2.0.0": {
          breaking: ["API changes", "Configuration updates"],
          impact: "low",
          effort: "low",
        },
      },
      "@vercel/edge-config": {
        "2.0.0": {
          breaking: ["API changes", "Edge runtime updates"],
          impact: "low",
          effort: "low",
        },
      },

      // Production Dependencies - AI/ML
      ai: {
        "6.0.0": {
          breaking: ["SDK API changes", "Provider interface updates"],
          impact: "high",
          effort: "medium",
        },
        "5.0.0": {
          breaking: ["Streaming API updates", "Provider changes"],
          impact: "medium",
          effort: "low",
        },
      },
      "@ai-sdk/openai": {
        "3.0.0": {
          breaking: ["OpenAI API changes", "Model interface updates"],
          impact: "medium",
          effort: "medium",
        },
        "2.0.0": {
          breaking: ["Provider API updates", "Configuration changes"],
          impact: "low",
          effort: "low",
        },
      },

      // Production Dependencies - Communication
      resend: {
        "7.0.0": {
          breaking: ["API changes", "Email template updates"],
          impact: "medium",
          effort: "low",
        },
      },
      "@intercom/messenger-js-sdk": {
        "1.0.0": {
          breaking: ["Messenger API changes", "Initialization updates"],
          impact: "low",
          effort: "low",
        },
      },

      // Dev Dependencies - Build & Style
      typescript: {
        "6.0.0": {
          breaking: ["Potential compiler changes", "Type inference changes"],
          impact: "high",
          effort: "high",
        },
        "5.0.0": {
          breaking: ["Decorators changes", "Enum changes", "Const assertions"],
          impact: "medium",
          effort: "medium",
        },
      },
      tailwindcss: {
        "5.0.0": {
          breaking: ["Engine changes", "Config format", "Plugin API"],
          impact: "high",
          effort: "high",
        },
        "4.0.0": {
          breaking: ["New CSS engine", "Config changes", "PostCSS setup", "Some utilities renamed"],
          impact: "high",
          effort: "medium",
        },
      },
      "@tailwindcss/postcss": {
        "5.0.0": {
          breaking: ["Engine changes", "Config format changes"],
          impact: "high",
          effort: "medium",
        },
        "4.0.0": {
          breaking: ["New engine integration", "CSS output format"],
          impact: "medium",
          effort: "low",
        },
      },
      postcss: {
        "9.0.0": {
          breaking: ["Plugin API changes", "Configuration updates"],
          impact: "medium",
          effort: "medium",
        },
      },
      autoprefixer: {
        "11.0.0": {
          breaking: ["PostCSS 8 required", "Config format updates"],
          impact: "low",
          effort: "low",
        },
      },

      // Dev Dependencies - Linting & Format
      "@biomejs/biome": {
        "3.0.0": {
          breaking: ["Config format changes", "Rule changes", "CLI changes"],
          impact: "medium",
          effort: "medium",
        },
        "2.0.0": {
          breaking: ["Config schema updates", "New rules", "Performance improvements"],
          impact: "low",
          effort: "low",
        },
      },

      // Dev Dependencies - Testing
      "@testing-library/react": {
        "17.0.0": {
          breaking: ["React 19+ required", "Hook testing changes"],
          impact: "medium",
          effort: "low",
        },
        "16.0.0": {
          breaking: ["React 19 required", "Query API updates"],
          impact: "medium",
          effort: "low",
        },
      },
      "@testing-library/jest-dom": {
        "7.0.0": {
          breaking: ["Assertion API updates", "Matchers refactoring"],
          impact: "low",
          effort: "low",
        },
      },
      "happy-dom": {
        "21.0.0": {
          breaking: ["DOM API updates", "Event handling changes"],
          impact: "low",
          effort: "low",
        },
      },

      // Dev Dependencies - Type Definitions
      "@types/react": {
        "20.0.0": {
          breaking: ["React 20 API changes", "Hook types updated"],
          impact: "low",
          effort: "low",
        },
        "19.0.0": {
          breaking: ["React 19 API changes", "Concurrent types"],
          impact: "low",
          effort: "low",
        },
      },
      "@types/react-dom": {
        "20.0.0": {
          breaking: ["React 20 API changes", "Portal types updated"],
          impact: "low",
          effort: "low",
        },
        "19.0.0": {
          breaking: ["React 19 API changes", "Hydration types"],
          impact: "low",
          effort: "low",
        },
      },
      "@types/node": {
        "25.0.0": {
          breaking: ["Node.js 22+ types", "Removed deprecated APIs"],
          impact: "low",
          effort: "low",
        },
        "24.0.0": {
          breaking: ["Node.js 20+ types", "Some APIs deprecated"],
          impact: "low",
          effort: "low",
        },
      },
    }
  }

  async checkPackageUpdates(): Promise<void> {
    console.log(
      `${COLORS.cyan}${COLORS.bright}[MONITOR] Package Update Monitor - Bun Native TypeScript${COLORS.reset}\n`
    )

    try {
      // Clean up old plan files before checking for new updates
      this.cleanupOldPlans()

      // Get bun outdated information
      const updates = await this.getBunOutdated()

      if (updates.length === 0) {
        console.log(`${COLORS.green}[OK] All packages are up to date!${COLORS.reset}`)
        if (this.excludedPackages.size > 0) {
          console.log(
            `${COLORS.yellow}Protected packages (${this.excludedPackages.size}): ${Array.from(this.excludedPackages).join(", ")}${COLORS.reset}`
          )
        }
        return
      }

      // Analyze each update
      const analyzed = updates.map((update) => this.analyzeUpdate(update))

      // Filter by criticality if requested
      const filtered = this.criticalOnly
        ? analyzed.filter((update) => update.priority === "critical" || update.hasSecurity)
        : analyzed

      if (filtered.length === 0 && this.criticalOnly) {
        console.log(`${COLORS.green}[OK] No critical updates found!${COLORS.reset}`)
        return
      }

      // Sort by priority and impact
      filtered.sort((a, b) => this.priorityScore(b) - this.priorityScore(a))

      // Display recommendations
      this.displayRecommendations(filtered)

      // Generate action plan
      this.generateActionPlan(filtered)

      // Run verification checks if requested
      if (this.runVerify) {
        const verifyPassed = await this.runVerificationChecks()
        if (!verifyPassed) {
          console.error(
            `${COLORS.red}${COLORS.bright}Verification failed. Please fix issues before committing.${COLORS.reset}\n`
          )
          process.exit(1)
        }
      }

      // Cleanup generated plan file at the end
      this.cleanupGeneratedPlan()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`${COLORS.red}[ERROR] Monitor failed:${COLORS.reset}`, message)
    }
  }

  private getBunOutdated(): PackageUpdate[] {
    const { execSync } = require("node:child_process")
    try {
      const output = execSync("bun outdated 2>&1", { encoding: "utf8" })
      return this.parseBunOutdated(output)
    } catch (error) {
      // bun outdated may exit with non-zero if updates are available
      if (error && typeof error === "object" && "stdout" in error) {
        return this.parseBunOutdated(String(error.stdout))
      }
      const message = error instanceof Error ? error.message : String(error)
      console.error(`${COLORS.red}Failed to check updates:${COLORS.reset}`, message)
      return []
    }
  }

  private parseBunOutdated(output: string): PackageUpdate[] {
    const updates: PackageUpdate[] = []
    const lines = output.split("\n")

    // Parse bun outdated table format
    // Example: "| next                       | 16.0.0  | 16.0.0 | 16.0.1  |"
    for (const line of lines) {
      const match = line.match(
        /^\|\s*(@?[\w-/@.]+)(?:\s+\(dev\))?\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|/
      )
      if (match) {
        const [, name, current, , latest] = match
        // Filter out excluded packages and only add if there's an actual update
        if (latest !== current && !this.excludedPackages.has(name.trim())) {
          updates.push({
            name: name.trim(),
            current: current.trim(),
            latest: latest.trim(),
            type: "dependencies",
          })
        }
      }
    }

    return updates
  }

  private analyzeUpdate(update: PackageUpdate): AnalyzedUpdate {
    const { name, current, latest } = update
    const analysis: AnalyzedUpdate = {
      ...update,
      priority: this.calculatePriority(update),
      breakingChanges: [],
      impact: "low",
      effort: "low",
      hasSecurity: false,
      recommendation: "safe",
    }

    // Check for known breaking changes
    if (this.knownBreakingChanges[name]) {
      const versions = Object.keys(this.knownBreakingChanges[name])
      for (const version of versions) {
        if (this.isVersionInRange(current, latest, version)) {
          const changeInfo = this.knownBreakingChanges[name][version]
          analysis.breakingChanges.push(...changeInfo.breaking)
          analysis.impact = changeInfo.impact
          analysis.effort = changeInfo.effort
          analysis.recommendation = "caution"
        }
      }
    }

    // Check for major version changes
    const [currentMajor] = current.split(".")
    const [latestMajor] = latest.split(".")

    if (Number.parseInt(latestMajor, 10) > Number.parseInt(currentMajor, 10)) {
      analysis.priority = "high"
      analysis.impact = analysis.impact === "low" ? "medium" : analysis.impact
      if (analysis.recommendation === "safe") {
        analysis.recommendation = "caution"
      }
    }

    // Check for security indicators
    if (this.hasSecurityKeywords(name)) {
      analysis.hasSecurity = true
      analysis.priority = "critical"
      analysis.recommendation = "urgent"
    }

    return analysis
  }

  private calculatePriority(update: PackageUpdate): "critical" | "high" | "medium" | "low" {
    const { name } = update

    // HIGH PRIORITY: Core framework & language
    const criticalExact: Record<string, boolean> = {
      next: true,
      react: true,
      "react-dom": true,
      typescript: true,
    }
    if (criticalExact[name]) return "high"

    // HIGH PRIORITY: Production runtime dependencies
    const highExact: Record<string, boolean> = {
      "@vercel/analytics": true,
      "@vercel/speed-insights": true,
      "@vercel/edge-config": true,
      ai: true,
      "@ai-sdk/openai": true,
      resend: true,
    }
    if (highExact[name]) return "high"

    // MEDIUM PRIORITY: Build-time dependencies
    const mediumExact: Record<string, boolean> = {
      tailwindcss: true,
      "@tailwindcss/postcss": true,
      postcss: true,
      autoprefixer: true,
      "@intercom/messenger-js-sdk": true,
    }
    if (mediumExact[name]) return "medium"

    // LOW PRIORITY: Development tools only
    const lowExact: Record<string, boolean> = {
      "@biomejs/biome": true,
      "@testing-library/react": true,
      "@testing-library/jest-dom": true,
      "happy-dom": true,
      "@types/node": true,
      "@types/react": true,
      "@types/react-dom": true,
    }
    if (lowExact[name]) return "low"

    return "medium"
  }

  private isVersionInRange(current: string, latest: string, checkVersion: string): boolean {
    const parseVersion = (v: string): number[] => v.split(".").map((n) => Number.parseInt(n, 10))
    const [cMajor, cMinor, cPatch] = parseVersion(current)
    const [lMajor] = parseVersion(latest)
    const [chMajor, chMinor, chPatch] = parseVersion(checkVersion)

    if (chMajor > cMajor && chMajor <= lMajor) return true
    if (chMajor === cMajor && chMinor > cMinor) return true
    if (chMajor === cMajor && chMinor === cMinor && chPatch > cPatch) return true

    return false
  }

  private hasSecurityKeywords(name: string): boolean {
    const securityPackages = ["helmet", "cors", "csrf", "sanitize", "xss"]
    return securityPackages.some((pkg) => name.includes(pkg))
  }

  private priorityScore(update: AnalyzedUpdate): number {
    let score = 0

    switch (update.priority) {
      case "critical":
        score += 100
        break
      case "high":
        score += 50
        break
      case "medium":
        score += 25
        break
      case "low":
        score += 10
        break
    }

    if (update.hasSecurity) score += 200
    if (update.breakingChanges.length > 0) score += 30

    switch (update.impact) {
      case "high":
        score += 20
        break
      case "medium":
        score += 10
        break
      case "low":
        // No additional score for low impact
        break
    }

    return score
  }

  private displayRecommendations(updates: AnalyzedUpdate[]): void {
    console.log(`${COLORS.bright}[PLAN] Update Recommendations:${COLORS.reset}\n`)

    for (const update of updates) {
      const priorityColor: Record<string, string> = {
        critical: COLORS.red,
        high: COLORS.yellow,
        medium: COLORS.blue,
        low: COLORS.cyan,
      }

      const recommendationLabel: Record<string, string> = {
        urgent: "[URGENT]",
        caution: "[CAUTION]",
        safe: "[SAFE]",
      }

      console.log(
        `${recommendationLabel[update.recommendation]} ${COLORS.bright}${update.name}${COLORS.reset}`
      )
      console.log(
        `   ${COLORS.cyan}Current:${COLORS.reset} ${update.current} → ${COLORS.green}Latest:${COLORS.reset} ${update.latest}`
      )
      console.log(
        `   ${COLORS.yellow}Priority:${COLORS.reset} ${priorityColor[update.priority]}${update.priority.toUpperCase()}${COLORS.reset}`
      )
      console.log(
        `   ${COLORS.yellow}Impact:${COLORS.reset} ${update.impact} | ${COLORS.yellow}Effort:${COLORS.reset} ${update.effort}`
      )

      if (update.hasSecurity) {
        console.log(`   ${COLORS.red}[SECURITY] Security update detected${COLORS.reset}`)
      }

      if (update.breakingChanges.length > 0) {
        console.log(`   ${COLORS.red}[BREAKING] Breaking changes:${COLORS.reset}`)
        for (const change of update.breakingChanges) {
          console.log(`      - ${change}`)
        }
      }

      this.displayRecommendation(update)
      console.log("")
    }
  }

  private displayRecommendation(update: AnalyzedUpdate): void {
    switch (update.recommendation) {
      case "urgent":
        console.log(`   ${COLORS.red}${COLORS.bright}[URGENT] Update immediately${COLORS.reset}`)
        console.log(`   ${COLORS.red}   Command: bun update ${update.name}${COLORS.reset}`)
        break

      case "caution":
        console.log(`   ${COLORS.yellow}[CAUTION] Review breaking changes first${COLORS.reset}`)
        console.log(`   ${COLORS.yellow}   1. Review changelog on npm/GitHub${COLORS.reset}`)
        console.log(
          `   ${COLORS.yellow}   2. Test in development: bun update ${update.name}${COLORS.reset}`
        )
        console.log(`   ${COLORS.yellow}   3. Run tests: bun test && bun run build${COLORS.reset}`)
        break

      case "safe":
        console.log(`   ${COLORS.green}[SAFE] Update when convenient${COLORS.reset}`)
        console.log(`   ${COLORS.green}   Command: bun update ${update.name}${COLORS.reset}`)
        break
    }
  }

  private generateActionPlan(updates: AnalyzedUpdate[]): void {
    const urgent = updates.filter((u) => u.recommendation === "urgent")
    const caution = updates.filter((u) => u.recommendation === "caution")
    const safe = updates.filter((u) => u.recommendation === "safe")

    console.log(`${COLORS.bright}[PLAN] Action Plan:${COLORS.reset}\n`)

    if (urgent.length > 0) {
      console.log(
        `${COLORS.red}${COLORS.bright}[URGENT] IMMEDIATE ACTION (${urgent.length} packages):${COLORS.reset}`
      )
      for (const update of urgent) {
        console.log(`   bun update ${update.name}`)
      }
      console.log("")
    }

    if (caution.length > 0) {
      console.log(
        `${COLORS.yellow}${COLORS.bright}[CAUTION] PLANNED UPDATES (${caution.length} packages):${COLORS.reset}`
      )
      console.log("   1. Create feature branch: git checkout -b package-updates")
      for (const [index, update] of caution.entries()) {
        console.log(`   ${index + 2}. Update ${update.name}: bun update ${update.name}`)
        console.log("      Test thoroughly before proceeding")
      }
      console.log(`   ${caution.length + 2}. Run tests: bun test && bun run check`)
      console.log(`   ${caution.length + 3}. Build: bun run build`)
      console.log(`   ${caution.length + 4}. Merge when ready`)
      console.log("")
    }

    if (safe.length > 0) {
      console.log(
        `${COLORS.green}${COLORS.bright}[SAFE] ROUTINE UPDATES (${safe.length} packages):${COLORS.reset}`
      )
      console.log("   # Batch update command:")
      const safeUpdates = safe.map((u) => u.name).join(" ")
      console.log(`   bun update ${safeUpdates}`)
      console.log("")
    }

    this.saveActionPlan({ urgent, caution, safe })
  }

  private formatUrgentSection(updates: AnalyzedUpdate[]): string {
    if (updates.length === 0) return ""
    let content = `## URGENT UPDATES (${updates.length})\n\n`
    for (const update of updates) {
      content += `- **${update.name}**: ${update.current} → ${update.latest}\n`
      content += `  - Priority: ${update.priority}\n`
      content += `  - Security: ${update.hasSecurity ? "YES" : "No"}\n`
      content += `  - Command: \`bun update ${update.name}\`\n\n`
    }
    return content
  }

  private formatCautionSection(updates: AnalyzedUpdate[]): string {
    if (updates.length === 0) return ""
    let content = `## PLANNED UPDATES (${updates.length})\n\n`
    for (const update of updates) {
      content += `- **${update.name}**: ${update.current} → ${update.latest}\n`
      content += `  - Impact: ${update.impact} | Effort: ${update.effort}\n`
      if (update.breakingChanges.length > 0) {
        content += `  - Breaking Changes:\n${update.breakingChanges.map((c) => `    - ${c}\n`).join("")}`
      }
      content += `  - Command: \`bun update ${update.name}\`\n\n`
    }
    return content
  }

  private formatSafeSection(updates: AnalyzedUpdate[]): string {
    if (updates.length === 0) return ""
    const safeList = updates.map((u) => u.name).join(" ")
    return `## ROUTINE UPDATES (${updates.length})\n\n\`\`\`bash\nbun update ${safeList}\n\`\`\`\n\n`
  }

  private getChecklist(): string {
    return `\n---\n\n## Documentation Update Checklist\n
After installing updates, update the following files:

### 1. CLAUDE.md
- Update version numbers in "Tech Stack" section

### 2. README.md
- Update badge versions if major versions change
- Update "Tech Stack" section

### 3. Release Notes
- Location: \`docs/release-notes/YYYY-MM-wN-month.md\`
- Add entry with date and updated packages

### 4. Verify Installation
- Run: \`bun test\` - All tests pass
- Run: \`bun run check\` - Biome linting passes
- Run: \`bun run build\` - Production build succeeds\n`
  }

  private saveActionPlan(plan: ActionPlan): void {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `package-update-plan-${timestamp}.md`

    const content =
      `# Package Update Plan - ${timestamp}\n\n**Project:** 8leeai\n\n` +
      this.formatUrgentSection(plan.urgent) +
      this.formatCautionSection(plan.caution) +
      this.formatSafeSection(plan.safe) +
      this.getChecklist()

    try {
      require("node:fs").writeFileSync(filename, content)
      this.generatedPlanFile = filename
      console.log(`${COLORS.green}[SAVED] Action plan saved to: ${filename}${COLORS.reset}`)
      console.log(
        `${COLORS.cyan}   (This file will be automatically deleted after completion)${COLORS.reset}`
      )
      console.log("")
      console.log(
        `${COLORS.yellow}${COLORS.bright}REQUIRED: Update documentation after installation:${COLORS.reset}`
      )
      console.log(`${COLORS.yellow}   1. CLAUDE.md - Update versions in Tech Stack${COLORS.reset}`)
      console.log(`${COLORS.yellow}   2. README.md - Update badges + Tech Stack${COLORS.reset}`)
      console.log(`${COLORS.yellow}   3. docs/release-notes/ - Add new entry${COLORS.reset}`)
      console.log(
        `${COLORS.yellow}   4. Verify: bun test && bun run check && bun run build${COLORS.reset}`
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`${COLORS.red}[ERROR] Failed to save action plan:${COLORS.reset}`, message)
    }
  }

  private cleanupOldPlans(): void {
    try {
      const fs = require("node:fs")
      const files = fs.readdirSync(".") as string[]
      const planFiles = files.filter(
        (f: string) => f.startsWith("package-update-plan-") && f.endsWith(".md")
      )

      if (planFiles.length > 0) {
        console.log(
          `${COLORS.cyan}Cleaning up ${planFiles.length} old update plan file(s)...${COLORS.reset}`
        )
        for (const file of planFiles) {
          fs.unlinkSync(file)
          console.log(`${COLORS.green}   Removed: ${file}${COLORS.reset}`)
        }
        console.log("")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(`${COLORS.yellow}Could not clean up old plans: ${message}${COLORS.reset}\n`)
    }
  }

  private cleanupGeneratedPlan(): void {
    if (this.generatedPlanFile) {
      try {
        const fs = require("node:fs")
        if (fs.existsSync(this.generatedPlanFile)) {
          fs.unlinkSync(this.generatedPlanFile)
          console.log(
            `\n${COLORS.cyan}Cleaned up generated plan file: ${this.generatedPlanFile}${COLORS.reset}`
          )
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.log(`${COLORS.yellow}Could not clean up plan file: ${message}${COLORS.reset}`)
      }
    }
  }

  private runVerificationChecks(): boolean {
    const { execSync } = require("node:child_process")
    console.log(
      `\n${COLORS.cyan}${COLORS.bright}[VERIFY] Running verification checks...${COLORS.reset}\n`
    )

    try {
      // Run tests
      console.log(`${COLORS.cyan}[1/3] Running tests...${COLORS.reset}`)
      execSync("bun test", { stdio: "inherit" })

      // Run Biome linting
      console.log(`\n${COLORS.cyan}[2/3] Running Biome linting...${COLORS.reset}`)
      execSync("bunx biome check --write .", { stdio: "inherit" })

      // Run production build
      console.log(`\n${COLORS.cyan}[3/3] Running production build...${COLORS.reset}`)
      execSync("bun run build", { stdio: "inherit" })

      console.log(
        `\n${COLORS.green}${COLORS.bright}All verification checks passed!${COLORS.reset}\n`
      )
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`\n${COLORS.red}${COLORS.bright}Verification checks failed!${COLORS.reset}`)
      console.error(`${COLORS.red}${message}${COLORS.reset}\n`)
      return false
    }
  }

  async startWatchMode(): Promise<void> {
    console.log(`${COLORS.cyan}[WATCH] Starting package monitor in watch mode...${COLORS.reset}`)
    console.log(`${COLORS.cyan}   Checking every 6 hours. Press Ctrl+C to stop.${COLORS.reset}\n`)

    const checkInterval = 6 * 60 * 60 * 1000 // 6 hours

    // Initial check
    await this.checkPackageUpdates()

    // Set up periodic checks
    setInterval(async () => {
      console.log(
        `\n${COLORS.cyan}[CHECK] Scheduled package check - ${new Date().toLocaleString()}${COLORS.reset}`
      )
      await this.checkPackageUpdates()
    }, checkInterval)
  }
}

// CLI Interface
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const options: MonitorOptions = {
    watch: args.includes("--watch"),
    critical: args.includes("--critical"),
    verify: args.includes("--verify"),
  }

  const monitor = new PackageMonitorAgent(options)

  if (options.watch) {
    await monitor.startWatchMode()
  } else {
    await monitor.checkPackageUpdates()
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log(`\n${COLORS.yellow}[MONITOR] Package monitor stopped.${COLORS.reset}`)
  process.exit(0)
})

main().catch((error) => {
  console.error(`${COLORS.red}[ERROR] Monitor failed:${COLORS.reset}`, error)
  process.exit(1)
})
