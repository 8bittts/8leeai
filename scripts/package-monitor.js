#!/usr/bin/env node

/**
 * Package Update Monitor Agent - Bun Edition
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
 *    - MUST include entries for ALL 17 packages in package.json
 *    - Organized by category: Production Deps, Dev Deps (Build/Style, Linting, Testing, Types)
 *    - Each entry: { breaking: [...], impact: "high|medium|low", effort: "high|medium|low" }
 *
 * Automatic cleanup:
 *   - Removes generated .md file after simple/safe updates
 *   - Keeps .md file for complex updates (CAUTION/URGENT) requiring review
 *   - Cleans up old plan files when all packages are up to date
 *
 * Usage:
 *   bun run packages              # Check all packages
 *   bun run packages:watch        # Continuous monitoring
 *   bun run packages:critical     # Only critical/security updates
 */

import { execSync } from "node:child_process"
import fs from "node:fs"

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

class PackageMonitorAgent {
  constructor(options = {}) {
    this.watchMode = options.watch
    this.criticalOnly = options.critical
    this.packageJson = this.loadPackageJson()
    this.knownBreakingChanges = this.loadBreakingChangesDB()
  }

  loadPackageJson() {
    try {
      return JSON.parse(fs.readFileSync("package.json", "utf8"))
    } catch (error) {
      console.error("[ERROR] Failed to load package.json:", error.message)
      process.exit(1)
    }
  }

  loadBreakingChangesDB() {
    // ⚠️ CRITICAL: Breaking Changes Database
    // =====================================
    // MUST include ALL 17 packages from package.json (both dependencies & devDependencies)
    // If new packages are added to package.json, add entries here!
    // Format: { breaking: [...], impact: "high|medium|low", effort: "high|medium|low" }
    //
    // Organized by dependency type:
    // 1. Production Dependencies (used in runtime)
    // 2. Dev Dependencies - Build & Style (used during build)
    // 3. Dev Dependencies - Linting & Format (code quality)
    // 4. Dev Dependencies - Testing (test infrastructure)
    // 5. Dev Dependencies - Type Definitions (TypeScript only)

    return {
      // Production Dependencies
      next: {
        "16.0.0": {
          breaking: ["Potential App Router changes", "Node.js version requirements"],
          impact: "high",
          effort: "high",
        },
        "15.0.0": {
          breaking: [
            "App Router stabilized",
            "Image component optimizations",
            "Turbopack improvements",
          ],
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
        "8.0.0": {
          breaking: ["Safe parser removed", "Plugin API updates"],
          impact: "medium",
          effort: "low",
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
        "16.0.0": {
          breaking: ["React 19 required", "Hook testing changes"],
          impact: "medium",
          effort: "low",
        },
        "14.0.0": {
          breaking: ["React 17+ required", "Query API updates"],
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
        "13.0.0": {
          breaking: ["DOM API updates", "Event handling changes"],
          impact: "low",
          effort: "low",
        },
      },

      // Dev Dependencies - Type Definitions
      "@types/react": {
        "20.0.0": {
          breaking: ["React 19 API changes", "Hook types updated"],
          impact: "low",
          effort: "low",
        },
      },
      "@types/react-dom": {
        "20.0.0": {
          breaking: ["React 19 API changes", "Portal types updated"],
          impact: "low",
          effort: "low",
        },
      },
      "@types/node": {
        "23.0.0": {
          breaking: ["Node.js 20+ types", "Removed deprecated APIs"],
          impact: "low",
          effort: "low",
        },
        "22.0.0": {
          breaking: ["Node.js 18+ types", "Some APIs deprecated"],
          impact: "low",
          effort: "low",
        },
      },
    }
  }

  checkPackageUpdates() {
    console.log(
      `${COLORS.cyan}${COLORS.bright}[MONITOR] Package Update Monitor - Bun Edition${COLORS.reset}\n`
    )

    try {
      // Get bun outdated information
      const updates = this.getBunOutdated()

      if (updates.length === 0) {
        console.log(`${COLORS.green}[OK] All packages are up to date!${COLORS.reset}`)
        // Clean up any old update plan files when everything is up to date
        this.cleanupOldPlans()
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

      // Generate action plan and get file info
      const planInfo = this.generateActionPlan(filtered)

      // Clean up the plan file if it's not needed (only simple updates)
      if (!planInfo.keepFile && planInfo.filename) {
        this.cleanupPlanFile(planInfo.filename)
      }
    } catch (error) {
      console.error(`${COLORS.red}[ERROR] Monitor failed:${COLORS.reset}`, error.message)
    }
  }

  getBunOutdated() {
    try {
      // Run bun outdated and capture output
      const output = execSync("bun outdated 2>&1", { encoding: "utf8" })
      return this.parseBunOutdated(output)
    } catch (error) {
      // bun outdated may exit with non-zero if updates are available
      if (error.stdout) {
        return this.parseBunOutdated(error.stdout)
      }
      console.error(`${COLORS.red}Failed to check updates:${COLORS.reset}`, error.message)
      return []
    }
  }

  parseBunOutdated(output) {
    const updates = []
    const lines = output.split("\n")

    // Parse bun outdated table format
    // Example table row: "| next                       | 16.0.0  | 16.0.0 | 16.0.1  |"
    // Handles scoped packages and (dev) suffix
    for (const line of lines) {
      // Match: | package-name (optional (dev)) | current | update | latest |
      const match = line.match(/^\|\s*(@?[\w-/@.]+)(?:\s+\(dev\))?\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|/)
      if (match) {
        const [, name, current, update, latest] = match
        // Only add if there's an actual update (latest > current)
        if (latest !== current) {
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

  analyzeUpdate(update) {
    const { name, current, latest } = update
    const analysis = {
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
    if (this.hasSecurityKeywords(name, latest)) {
      analysis.hasSecurity = true
      analysis.priority = "critical"
      analysis.recommendation = "urgent"
    }

    return analysis
  }

  calculatePriority(update) {
    const { name } = update

    // ⚠️ IMPORTANT: Use EXACT package name matching ONLY
    // DO NOT use includes() - it causes false positives!
    // Example bug: name.includes("react") matched "@testing-library/react" as HIGH

    // HIGH PRIORITY: Core framework & language
    // Updates to these may break the entire application
    const criticalExact = {
      next: true,
      react: true,
      "react-dom": true,
      typescript: true,
    }
    if (criticalExact[name]) {
      return "high"
    }

    // HIGH PRIORITY: Production runtime dependencies
    // Used in production builds, monitoring analytics
    const highExact = {
      "@vercel/analytics": true,
      "@vercel/speed-insights": true,
    }
    if (highExact[name]) {
      return "high"
    }

    // MEDIUM PRIORITY: Build-time dependencies
    // Used during dev/build, affects CSS and styling
    const mediumExact = {
      tailwindcss: true,
      "@tailwindcss/postcss": true,
      postcss: true,
      autoprefixer: true,
    }
    if (mediumExact[name]) {
      return "medium"
    }

    // LOW PRIORITY: Development tools only
    // Test runners, type definitions, linting - dev-only, can update freely
    const lowExact = {
      "@biomejs/biome": true,
      "@testing-library/react": true,
      "@testing-library/jest-dom": true,
      "happy-dom": true,
      "@types/node": true,
      "@types/react": true,
      "@types/react-dom": true,
    }
    if (lowExact[name]) {
      return "low"
    }

    // Default fallback for any new packages
    return "medium"
  }

  isVersionInRange(current, latest, checkVersion) {
    const parseVersion = (v) => v.split(".").map((n) => Number.parseInt(n, 10))
    const [cMajor, cMinor, cPatch] = parseVersion(current)
    const [lMajor] = parseVersion(latest)
    const [chMajor, chMinor, chPatch] = parseVersion(checkVersion)

    // Check if the version we're checking is between current and latest
    if (chMajor > cMajor && chMajor <= lMajor) return true
    if (chMajor === cMajor && chMinor > cMinor) return true
    if (chMajor === cMajor && chMinor === cMinor && chPatch > cPatch) return true

    return false
  }

  hasSecurityKeywords(name, _version) {
    // Heuristic for security-related packages
    const securityPackages = ["helmet", "cors", "csrf", "sanitize", "xss"]
    return securityPackages.some((pkg) => name.includes(pkg))
  }

  priorityScore(update) {
    let score = 0

    // Base priority score
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

    // Security bonus
    if (update.hasSecurity) score += 200

    // Breaking changes penalty (handle carefully)
    if (update.breakingChanges.length > 0) score += 30

    // Impact scoring
    switch (update.impact) {
      case "high":
        score += 20
        break
      case "medium":
        score += 10
        break
    }

    return score
  }

  displayRecommendations(updates) {
    console.log(`${COLORS.bright}[PLAN] Update Recommendations:${COLORS.reset}\n`)

    for (const update of updates) {
      const priorityColor = {
        critical: COLORS.red,
        high: COLORS.yellow,
        medium: COLORS.blue,
        low: COLORS.cyan,
      }[update.priority]

      const recommendationLabel = {
        urgent: "[URGENT]",
        caution: "[CAUTION]",
        safe: "[SAFE]",
      }[update.recommendation]

      console.log(`${recommendationLabel} ${COLORS.bright}${update.name}${COLORS.reset}`)
      console.log(
        `   ${COLORS.cyan}Current:${COLORS.reset} ${update.current} → ${COLORS.green}Latest:${COLORS.reset} ${update.latest}`
      )
      console.log(
        `   ${COLORS.yellow}Priority:${COLORS.reset} ${priorityColor}${update.priority.toUpperCase()}${COLORS.reset}`
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
          console.log(`      • ${change}`)
        }
      }

      this.displayRecommendation(update)
      console.log("")
    }
  }

  displayRecommendation(update) {
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

  generateActionPlan(updates) {
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

    // Save action plan to file (returns filename for cleanup later)
    return this.saveActionPlan({ urgent, caution, safe })
  }

  formatUrgentUpdates(updates) {
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

  formatCautionUpdates(updates) {
    if (updates.length === 0) return ""
    let content = `## PLANNED UPDATES (${updates.length})\n\n`
    for (const update of updates) {
      content += `- **${update.name}**: ${update.current} → ${update.latest}\n`
      content += `  - Impact: ${update.impact} | Effort: ${update.effort}\n`
      if (update.breakingChanges.length > 0) {
        content += "  - Breaking Changes:\n"
        for (const change of update.breakingChanges) {
          content += `    - ${change}\n`
        }
      }
      content += `  - Command: \`bun update ${update.name}\`\n\n`
    }
    return content
  }

  formatSafeUpdates(updates) {
    if (updates.length === 0) return ""
    let content = `## ROUTINE UPDATES (${updates.length})\n\n`
    const safeList = updates.map((u) => u.name).join(" ")
    content += `\`\`\`bash\nbun update ${safeList}\n\`\`\`\n\n`
    return content
  }

  saveActionPlan(plan) {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `package-update-plan-${timestamp}.md`
    const hasComplexUpdates = plan.caution.length > 0 || plan.urgent.length > 0

    let content = `# Package Update Plan - ${timestamp}\n\n`
    content += "Generated by Package Monitor Agent (Bun Edition)\n\n"
    content += this.formatUrgentUpdates(plan.urgent)
    content += this.formatCautionUpdates(plan.caution)
    content += this.formatSafeUpdates(plan.safe)
    content += "---\n\n"
    content += "**Testing Checklist:**\n"
    content += "- [ ] `bun test` - All tests pass\n"
    content += "- [ ] `bun run check` - Biome linting passes\n"
    content += "- [ ] `bun run build` - Production build succeeds\n"
    content += "- [ ] Manual testing of key features\n"

    try {
      fs.writeFileSync(filename, content)
      console.log(`${COLORS.green}[SAVED] Action plan saved to: ${filename}${COLORS.reset}`)

      // Return filename and whether it should be kept for complex updates
      return { filename, keepFile: hasComplexUpdates }
    } catch (error) {
      console.error(
        `${COLORS.red}[ERROR] Failed to save action plan:${COLORS.reset}`,
        error.message
      )
      return { filename: null, keepFile: false }
    }
  }

  cleanupPlanFile(filename) {
    try {
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename)
        console.log(
          `${COLORS.cyan}[CLEANUP] Removed ${filename} (only safe updates, no file needed)${COLORS.reset}`
        )
      }
    } catch (error) {
      console.error(
        `${COLORS.yellow}[WARN] Failed to cleanup plan file:${COLORS.reset}`,
        error.message
      )
    }
  }

  cleanupOldPlans() {
    try {
      const files = fs.readdirSync(".")
      const planFiles = files.filter(
        (f) => f.startsWith("package-update-plan-") && f.endsWith(".md")
      )

      if (planFiles.length > 0) {
        for (const file of planFiles) {
          fs.unlinkSync(file)
          console.log(`${COLORS.cyan}[CLEANUP] Removed old plan file: ${file}${COLORS.reset}`)
        }
      }
    } catch (_error) {
      // Silent fail - cleanup is non-critical
    }
  }

  async startWatchMode() {
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
async function main() {
  const args = process.argv.slice(2)
  const options = {
    watch: args.includes("--watch"),
    critical: args.includes("--critical"),
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`${COLORS.red}[ERROR] Monitor failed:${COLORS.reset}`, error)
    process.exit(1)
  })
}
