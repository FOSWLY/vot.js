import js from "@eslint/js";
// import globals from "globals";
import oxlint from "eslint-plugin-oxlint";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/*", "docs/*", "**/*.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  {
    rules: {
      // "@typescript-eslint/ban-types": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "sonarjs/max-switch-cases": 0,
      "@typescript-eslint/consistent-type-definitions": 0,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: true,
        tsconfigDirName: import.meta.dirname,
      },
      globals: {
        // ...globals.node,
      },
    },
  },
  oxlint.configs["flat/recommended"], // oxlint should be the last one
);
