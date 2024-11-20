import js from "@eslint/js";
import oxlint from "eslint-plugin-oxlint";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist",
      "docs/*",
      "**/*.d.ts",
      "examples/*",
      "scripts/*",
      "test-scripts/*",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/consistent-type-definitions": 0,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: true,
        tsconfigDirName: import.meta.dirname,
      },
    },
  },
  oxlint.configs["flat/recommended"], // oxlint should be the last one
);
