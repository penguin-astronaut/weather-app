module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["airbnb-base", "plugin:@typescript-eslint/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-alert": "off",
    "import/no-unresolved": "off",
    "import/extensions": ["warn", "never"],
    "import/prefer-default-export": "off",
    "no-param-reassign": "off",
    "max-classes-per-file": "off",
    "class-methods-use-this": "off",
  },
  plugins: ["jest", "@typescript-eslint"],
};
