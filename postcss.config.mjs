// PostCSS configuration (ESM) — best-practice ordering for Tailwind + Radix
// - postcss-import runs first so any @import rules are resolved
// - tailwindcss/nesting provides nesting support and must run before Tailwind
// - tailwindcss processes utility & component generation
// - postcss-preset-env handles modern CSS polyfills (includes autoprefixer)
import postcssImport from 'postcss-import';
import tailwindNesting from 'tailwindcss/nesting';
import tailwindcss from 'tailwindcss/postcss';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssImport(),
    tailwindNesting(),
    tailwindcss(),
    postcssPresetEnv({
      // stage 3 enables a useful set of polyfills; adjust to your needs
      stage: 3,
      // disable nesting in preset-env because we're providing nesting via tailwindcss/nesting
      features: {
        'nesting-rules': false,
      },
    }),
  ],
};
