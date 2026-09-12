// Tailwind v4 ships its own PostCSS plugin and handles vendor prefixing,
// so there is no `tailwindcss`/`autoprefixer` pair anymore.
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
