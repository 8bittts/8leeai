"use client"

/**
 * Zendesk ASCII Art Header
 * Displays the Zendesk logo and welcome message at the top of the interface
 */
export function ZendeskHeader() {
  return (
    <div className="w-full">
      {/* macOS-style Window Controls */}
      <div className="px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex items-center gap-2 border-b border-green-500/30">
        <button
          type="button"
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black"
          title="Close"
          aria-label="Close window"
        />
        <button
          type="button"
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
          title="Minimize"
          aria-label="Minimize window"
        />
        <button
          type="button"
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
          title="Maximize"
          aria-label="Maximize window"
        />
      </div>

      {/* Header Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-2 border-b border-green-500/20">
        {/* ASCII Art Logo */}
        <pre className="text-green-500 font-mono text-xs md:text-sm leading-tight">
          {`______     ______     __   __     _____     ______     ______     __  __
/\\___  \\   /\\  ___\\   /\\ "-.\\ \\   /\\  __-.  /\\  ___\\   /\\  ___\\   /\\ \\/ /
\\/_/  /__  \\ \\  __\\   \\ \\ \\-.  \\  \\ \\ \\/\\ \\ \\ \\  __\\   \\ \\___  \\  \\ \\  _"-.
  /\\_____\\  \\ \\_____\\  \\ \\_\\\\"\\_\\  \\ \\____-  \\ \\_____\\  \\/\\_____\\  \\ \\_\\ \\_\\
  \\/_____/   \\/_____/   \\/_/ \\/_/   \\/____/   \\/_____/   \\/_____/   \\/_/\\/_/`}
        </pre>

        {/* Welcome Message */}
        <div className="mt-3 space-y-1 text-sm">
          <p className="text-green-500">
            Zendesk Intelligence Portal - EXPERIMENTAL MODE ACTIVATED
          </p>
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
    </div>
  )
}
