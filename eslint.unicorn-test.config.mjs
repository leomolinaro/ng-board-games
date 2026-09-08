import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import unicorn from "eslint-plugin-unicorn";

export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: { unicorn, "@typescript-eslint": tsPlugin },
    rules: {
      // "unicorn/switch-case-braces": "off",
      // "unicorn/explicit-length-check": "off",
      // "unicorn/no-null": "error",
      "unicorn/prefer-spread": "error",
      // "unicorn/consistent-boolean-name": "error",
      // "unicorn/name-replacements": "error",
      // "unicorn/consistent-class-member-order": "error",
      // "unicorn/no-array-reduce": "error",
      // "unicorn/prefer-hoisting-branch-code": "error",
      // "unicorn/no-immediate-mutation": "error",
      // "unicorn/no-useless-else": "error",
      // "unicorn/prefer-type-literal-last": "error",
    },
  },
];
