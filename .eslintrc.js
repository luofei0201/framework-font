// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': 0,
    'no-tabs': 0,
    'semi': [2, 'never'],
    'comma-dangle': ['error', 'never'],
    'import/no-unresolved': 0,
    'space-before-function-paren': ["error", "never"],
    'quote-props': ['error', 'as-needed', { 'keywords': true, 'unnecessary': false }],
    'no-console': 0,
    'no-alert': 0,
    'no-use-before-define': 0,
    'vue/no-parsing-error': [2, { 'invalid-first-character-of-tag-name': false, 'x-invalid-end-tag': false }],
    'camelcase': 0,
    'prefer-promise-reject-errors': ['error', {'allowEmptyReject': true}],
    'no-extend-native': ['error', { 'exceptions': ['Object', 'String'] }],
    'brace-style': 0,
    'no-cond-assign': 0
  }
}
