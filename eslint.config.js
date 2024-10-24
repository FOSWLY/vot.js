import js from "@eslint/js";
import oxlint from "eslint-plugin-oxlint";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/*",
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  sonarjs.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": 0,
      "sonarjs/max-switch-cases": 0,
      "@typescript-eslint/consistent-type-definitions": 0,
      "sonarjs/single-char-in-character-classes": 0,
      "sonarjs/slow-regex": 0,
      "sonarjs/function-return-type": 0,
      // sonarjs/sonar-no-fallthrough crashed in 2.0.1
      "sonarjs/sonar-no-fallthrough": 0,
      "sonarjs/single-character-alternation": 0,
      "sonarjs/anchor-precedence": 0,
      "sonarjs/todo-tag": 0,
      "sonarjs/redundant-type-aliases": 0,
      "sonarjs/cognitive-complexity": "warn",
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
