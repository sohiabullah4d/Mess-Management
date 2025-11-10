module.exports = {
  env: {
    browser: true,
  },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "@next/next/no-img-element": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
