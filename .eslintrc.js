module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "jest"],
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "jest/no-hooks": "off",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:jest/all",
  ],
};
