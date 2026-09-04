import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // ── Main rule set for all app source files ─────────────────────────────
  {
    files: ["src/**/*.{ts,tsx}"],

    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
    },

    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: { version: "detect" },
    },

    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Not needed with React 17+ JSX transform
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // ── CORE RULE: ban deep relative imports ────────────────────────────
      // Imports going 2+ levels up must use the @/ alias instead.
      // Single-level ../ within the same feature folder is still allowed.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*", "../../../*", "../../../../*", "../../../../../*"],
              message:
                "Deep relative imports are not allowed. Use the @/ alias instead (e.g. '@/lib/utils', '@/data', '@/hooks').",
            },
          ],
        },
      ],

      // TypeScript relaxations
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // ── Relaxed rules for generated Shadcn UI components ──────────────────
  // These files are auto-generated/copied from shadcn and should not be
  // manually edited. We only enforce the import rule here.
  {
    files: ["src/components/ui/**/*.{ts,tsx}", "src/hooks/use-mobile.tsx"],

    rules: {
      // Shadcn-generated components use patterns that trigger these — ignore them
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react/no-unknown-property": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // ── Global ignores ─────────────────────────────────────────────────────
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/.generated/**",
      "*.config.{js,ts}",
    ],
  }
);
