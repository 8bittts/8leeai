# Design Review

Comprehensive design implementation review using ultrathink mode.

**IMPORTANT**: Use multiple parallel agents to check each item below for maximum comprehension, accuracy, and completeness. This is a GLOBAL AUDIT - do not miss or skip anything.

## Review Checklist

Launch parallel agents to analyze the codebase for each of these 9 areas:

### 1. Pure Tailwind v4
- Confirm all styling uses Tailwind v4 syntax and conventions
- Flag any v3 legacy patterns (`@tailwind` directives, old config patterns)
- Check `globals.css` uses `@import "tailwindcss"` and `@theme inline`

### 2. Zero inline styles
- Search for any `style={}` or `style=""` attributes in all TSX/JSX files
- All styling must be via Tailwind classes only
- Exception: truly dynamic values that cannot be Tailwind classes

### 3. Zero custom classes
- Check `globals.css` for any custom CSS class definitions
- No custom CSS class definitions allowed except necessary animations
- Verify no CSS modules exist

### 4. Zero hardcoded values
- No hardcoded colors (hex, rgb, hsl) in TSX files
- No hardcoded pixel values that should use Tailwind scale
- All values must use Tailwind's design tokens
- Exception: Canvas animation constants, email templates, SVG attributes

### 5. Zero duplicate design styles
- Check for repeated className patterns that should be extracted
- Identify inconsistent styling of similar components
- Look for duplicated component logic across files

### 6. Zero style conflicts
- Look for conflicting Tailwind classes (e.g., `hidden flex`, `w-full w-1/2`)
- Check for responsive breakpoint contradictions
- Identify padding/margin override issues

### 7. Zero unused/orphaned styles
- Find CSS variables defined but never used
- Check for classes referenced that don't exist
- **BE SUPER CAREFUL** - this is a production codebase
- Only flag with HIGH confidence, ask before removing

### 8. Full WCAG/ARIA coverage
- Verify all interactive elements have visible focus indicators
- Check for proper aria-label, aria-hidden, role attributes
- Verify color contrast ratios meet AA standards
- Ensure all form inputs have associated labels
- Check keyboard navigation and focus order

### 9. Normalized patterns
- Typography: consistent font sizes, weights, line heights across similar elements
- Sizing: consistent component dimensions (input heights, button sizes)
- Spacing: consistent padding, margins, gaps in similar contexts
- Grid: consistent layout patterns and breakpoint usage

## Process

1. **Launch** parallel agents for each checklist item to scan the entire codebase
2. **Document** all findings with file paths and line numbers
3. **Categorize** issues by severity (critical, major, minor)
4. **ASK** before making any changes if uncertain
5. **Report** comprehensive findings with specific recommendations
6. **Fix** all identified issues for 100% compliance

If you have any issues, concerns, or are not sure about something, ask before proceeding.
