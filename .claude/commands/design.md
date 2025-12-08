# Design Review

Comprehensive design implementation review using ultrathink mode.

## Review Checklist

Analyze the codebase for the following issues:

### 1. Pure shadcn
- Verify all shadcn/ui components are unmodified from their original implementation
- Check for unauthorized customizations to base components

### 2. Pure Tailwind v4
- Confirm all styling uses Tailwind v4 syntax and conventions
- Flag any v3 legacy patterns or deprecated utilities

### 3. Zero inline styles
- Search for any `style={}` or `style=""` attributes in components
- All styling must be via Tailwind classes only

### 4. Zero custom components
- Verify components use shadcn/ui primitives
- Flag any custom-built UI components that should use shadcn

### 5. Zero custom classes
- Check for any CSS classes not from Tailwind
- No custom CSS class definitions allowed

### 6. Zero hardcoded values
- No hardcoded colors, sizes, or spacing values
- All values must use Tailwind's design tokens

### 7. Zero duplicate design styles
- Check for repeated style patterns that should be consolidated
- Identify opportunities for design system consistency

### 8. Zero style conflicts
- Look for conflicting Tailwind classes
- Check for overridden styles that cause visual inconsistencies

### 9. Zero unused/orphaned styles
- Run knip or equivalent to find unused code
- **BE SUPER CAREFUL** - this is a production codebase
- Only flag with high confidence, ask before removing

### 10. Full WCAG/ARIA coverage
- Verify all interactive elements have proper ARIA attributes
- Check for proper heading hierarchy
- Verify color contrast ratios
- Ensure keyboard navigation works properly

### 11. Normalized patterns
- Typography: consistent font sizes, weights, line heights
- Sizing: consistent component dimensions
- Spacing: consistent padding, margins, gaps
- Grid: consistent layout patterns

## Process

1. **Scan** the codebase systematically for each checklist item
2. **Document** all findings with file paths and line numbers
3. **Categorize** issues by severity (critical, warning, suggestion)
4. **ASK** before making any changes if uncertain
5. **Report** comprehensive findings to the user

If you have any issues, concerns, or are not sure about something, ask before proceeding.
