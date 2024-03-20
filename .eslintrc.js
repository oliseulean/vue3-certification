module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-strongly-recommended', // This option imposes formatting rules on your code to improve readability
  ],
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    quotes: [2, 'single', { 'avoidEscape': true }],
    'vue/multi-word-component-names': 0,
  }
}