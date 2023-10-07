module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  overrides: [
    {
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    test: "readonly",
    jest: "readonly",
    describe: "readonly",
    it: "readonly",
    expect: "readonly",
  },
  rules: {
    semi: "error",
    "object-curly-spacing": ["error", "always"],
  },
};
