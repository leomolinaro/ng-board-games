// @ts-check

import js from "@eslint/js";
import angular from "angular-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ---------------------------------------------------------------------------
  // Global ignores
  // ---------------------------------------------------------------------------
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/.angular/**",
      "**/node_modules/**",

      // Generated files
      "**/*.gen.ts",
      "**/*.generated.ts",
    ],
  },

  // ---------------------------------------------------------------------------
  // JavaScript / TypeScript
  // ---------------------------------------------------------------------------
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.ts"],

    extends: [
      js.configs.recommended,

      // Type-aware correctness rules
      tseslint.configs.recommendedTypeChecked,

      // Type-aware stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Modern JS/TS idioms
      unicorn.configs.recommended,

      // Code smells / complexity
      sonarjs.configs.recommended,
    ],

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // -----------------------------------------------------------------------
      // TypeScript
      // -----------------------------------------------------------------------
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true, // For callbacks defined in maps
        },
      ],
      "@typescript-eslint/no-confusing-void-expression": "off", // Less curly braces
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // -----------------------------------------------------------------------
      // Unicorn
      // -----------------------------------------------------------------------
      "unicorn/switch-case-braces": "off", // Too verbose for my taste
      "unicorn/consistent-boolean-name": "off", // Good, maybe later
      "unicorn/name-replacements": [
        "off",
        {
          replacements: {
            param: false,
            params: false,
            util: false,
            utils: false,
            doc: false,
            docs: false,
            fn: false,
            curr: false,
            i: false,
            j: false,
            def: false,
            proto: false,
            prev: false,
            prop: false,
            props: false,
            ref: false,
            refs: false,
          },
        },
      ],
      "unicorn/consistent-class-member-order": "off", // Nice, maybe later
      "unicorn/consistent-function-scoping": "off", // Not sure
      "unicorn/prefer-includes-over-repeated-comparisons": "off", // Not sure
      "unicorn/single-line-block-comment-style": ["error", "single-line"],
      "unicorn/no-incorrect-template-string-interpolation": "off", // Wrong for scss styles in .ts
      "unicorn/no-nested-ternary": "off", // Conflicting with Prettier
      "unicorn/no-break-in-nested-loop": "off", // Good, maybe later
      "unicorn/no-computed-property-existence-check": "off", // Hard to follow
      "unicorn/no-useless-undefined": [
        "error",
        { checkArrowFunctionBody: false }, // Too verbose otherwise
      ],
      "unicorn/max-nested-calls": ["error", { max: 5 }],
      "unicorn/no-await-expression-member": "off", // Too verbose otherwise
      // -----------------------------------------------------------------------
      // SonarJS
      // -----------------------------------------------------------------------
      "sonarjs/max-switch-cases": "off", // Switch are bad in everycase, but sometimes simpler
      "sonarjs/no-duplicated-branches": "off", // Seems ok, but difficult for TODOs and switch cases
      "sonarjs/pseudo-random": "off", // Not concerned with pseudo-random number generation in this project
      "sonarjs/todo-tag": "off", // I'm using TODOs freely
      "sonarjs/cognitive-complexity": ["error", 50], // For now, allowing higher complexity in functions
      "sonarjs/function-return-type": "off", // Really I don't agree with this
    },
  },

  // ---------------------------------------------------------------------------
  // JavaScript config files
  //
  // These are normally not part of the TypeScript project, so don't require
  // type-aware linting for them.
  // ---------------------------------------------------------------------------
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // ---------------------------------------------------------------------------
  // Angular TypeScript
  // ---------------------------------------------------------------------------
  {
    files: ["**/*.ts"],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
  },

  // ---------------------------------------------------------------------------
  // Angular templates
  // ---------------------------------------------------------------------------
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      // angular.configs.templateAccessibility,
    ],
  },
);
