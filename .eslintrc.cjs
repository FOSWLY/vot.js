module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:oxlint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:sonarjs/recommended",
  ],
  plugins: ["@typescript-eslint", "sonarjs"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.js"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  ignorePatterns: ["node_modules", "dist", "docs", "**/*.d.ts"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
