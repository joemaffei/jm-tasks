module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  extends: ['plugin:vue/vue3-recommended', '@vue/eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // Add any custom rules here
  },
}
