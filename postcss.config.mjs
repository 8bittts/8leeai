/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Do not remove: Tailwind v4 / Lightning CSS does NOT fully replace this here.
    // Removing it changes built CSS output (drops -moz-column-gap and the -webkit
    // @supports prefix fallbacks). Only revisit if a built-CSS diff proves identical.
    autoprefixer: {},
  },
}

export default config
