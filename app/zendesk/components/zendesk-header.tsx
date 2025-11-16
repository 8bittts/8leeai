"use client"

/**
 * Zendesk ASCII Art Header
 * Displays the Zendesk logo and welcome message at the top of the interface
 */
export function ZendeskHeader() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 border-b border-green-500/20">
      {/* ASCII Art Logo */}
      <pre className="text-green-500 font-mono text-xs md:text-sm leading-tight">
        {` ________                     __                  __
/\\_____  \\                   /\\ \\                /\\ \\
\\/____//'/'     __    ___    \\_\\ \\     __    ____\\ \\ \\/'\\'
     //'/'    /'__\`\\/' _ \`\\  /'_\` \\  /'__\`\\ /',__\\\\ \\ , <
    //'/'___ /\\  __//\\ \\/\\ \\/\\ \\L\\ \\/\\  __//\\__, \`\\\\ \\ \\\\\`\\
    /\\_______\\ \\____\\ \\_\\ \\_\\ \\___,_\\ \\____\\/\\____/ \\ \\_\\ \\_\\
    \\/_______/\\/____/\\/_/\\/_/\\/__,_ /\\/____/\\/___/   \\/_/\\/_/`}
      </pre>

      {/* Welcome Message */}
      <div className="mt-3 space-y-1 text-sm">
        <p className="text-green-500">Welcome to Zendesk Intelligence Terminal</p>
        <p className="text-green-400 opacity-70 text-xs">
          Ask questions about your support tickets, customers, analytics, and more.
        </p>
      </div>

      {/* Quick Tips */}
      <div className="mt-2 text-xs text-green-400 opacity-50 space-y-0.5">
        <p>💡 Try: "show open tickets" or "what's our average response time?"</p>
        <p>⌨️ Use ↑↓ for command history • Ctrl+L to clear screen</p>
      </div>
    </div>
  )
}
