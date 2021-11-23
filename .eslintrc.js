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
    "import/no-extraneous-dependencies": "off",
    "no-param-reassign": "off",
    "max-classes-per-file": "off",
    "class-methods-use-this": "off",
    "no-else-return": "off",
  },
  plugins: ["jest", "@typescript-eslint"],
};
