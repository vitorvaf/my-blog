// ESLint configuration for the Gatsby blog.
// Extends Create React App's config (React/hooks/jsx-a11y/import rules), then
// disables any formatting-related rules so Prettier (see .prettierrc) owns
// stylistic choices and the two tools don't fight.
module.exports = {
  root: true,
  extends: ["react-app", "prettier"],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // Gatsby uses styled-components / MDX / etc.; PropTypes are widely omitted
    // in this codebase, so don't fail the build on missing prop-type declarations.
    "react/prop-types": "off",
  },
  overrides: [
    {
      // Gatsby lifecycle files run in Node and use CommonJS.
      files: ["gatsby-node.js", "gatsby-config.js", "gatsby-ssr.js", "gatsby-browser.js"],
      env: {
        node: true,
        browser: false,
      },
    },
  ],
}
