module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': [0, { js: 'always' }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-use-before-define': ['error', {
      functions: false,
      classes: true,
      variables: false,
      allowNamedExports: false,
    }],
    radix: ['error', 'as-needed'],
    'no-shadow': 'off',

    'no-inner-declarations': 0,
    'no-param-reassign': ['error', { props: false }],
    'no-alert': 'off',

  },
};
