// @ts-check

import js from "@eslint/js";
// import sonarjs from "eslint-plugin-sonarjs";
import angular from "angular-eslint";
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
      // unicorn.configs.unopinionated,

      // // Code smells / complexity
      // sonarjs.configs.recommended,
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
      // Prefer the TS-aware versions of these rules.
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Allow void expressions such as:
      //   signal.update(...)
      //   observable.subscribe(...)
      "@typescript-eslint/no-confusing-void-expression": "off",
      // I prefer this to be explicit rather than relying on inference.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
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
      // // Often annoying in Angular code:
      // //   @Input() is sometimes intentionally written in Angular style.
      // "unicorn/prefer-ternary": "off",
      // // Can conflict with Angular APIs / framework conventions.
      // "unicorn/prefer-number-properties": "error",
      // // Don't force obscure Unicode escapes / alternatives.
      // "unicorn/prefer-code-point": "off",
      "unicorn/switch-case-braces": "off", // Too verbose for my taste
      "unicorn/no-null": "off", // Nice, maybe later
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
      "unicorn/max-nested-calls": ["error", { max: 5 }],
      "unicorn/no-await-expression-member": "off", // Too verbose otherwise
      // // -----------------------------------------------------------------------
      // // SonarJS
      // // -----------------------------------------------------------------------
      // // Too opinionated for general application code.
      // "sonarjs/cognitive-complexity": ["warn", 20],
      // // Often produces noise with Angular template-driven callback code.
      // "sonarjs/no-nested-functions": "off",
      // // Useful, but not something I would block CI on initially.
      // "sonarjs/no-duplicated-branches": "warn",
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

  // ---------------------------------------------------------------------------
  // Tests
  // ---------------------------------------------------------------------------
  {
    files: [
      "**/*.spec.ts",
      "**/*.test.ts",
      "**/test/**/*.ts",
      "**/tests/**/*.ts",
    ],

    rules: {
      // Tests are intentionally less strict in some respects.
      "@typescript-eslint/no-explicit-any": "off",
      "sonarjs/no-duplicate-string": "off",
    },
  },
);
