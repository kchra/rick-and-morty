module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    // '@vue/airbnb',
    'airbnb-base',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.vue'],
      },
    },
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
};
