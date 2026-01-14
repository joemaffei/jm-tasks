module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-prettier',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['dist', 'node_modules', '*.config.js', '*.config.cjs'],
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  rules: {
    // Add any custom rules here
  },
}
