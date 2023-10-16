module.exports = {
  root: true,
  env: {
    node: true,
  },
  // extends: ['plugin:vue/strongly-recommended', '@vue/standard'],
  extends: [
    'eslint:recommended', //继承Eslint中推荐的（打钩的）规则项http://eslint.cn/docs/rules/
    'plugin:vue/essential', // 此项是用来配置vue.js风格
    'prettier', //把prettier中设置的规则添加进来，让它覆盖上面设置的规则。这样就不会和上面的规则冲突了
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'generator-star-spacing': 'off',
    'no-mixed-operators': 0,
    'no-mixed-spaces-and-tabs': 0,
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 5,
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/attribute-hyphenation': 0,
    'vue/html-self-closing': 0,
    'vue/component-name-in-template-casing': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/no-unused-components': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/no-parsing-error': 0,
    'no-tabs': 0,
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: [
      2,
      'off',
      {
        beforeStatementContinuationChars: 'never',
      },
    ],
    'no-delete-var': 2,
    'prefer-const': [
      2,
      {
        ignoreReadBeforeAssign: false,
      },
    ],
    'template-curly-spacing': 'off',
    indent: ['error', 2],
    'space-before-function-paren': 'off',
  },
  parserOptions: {
    // parser: 'babel-eslint',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
