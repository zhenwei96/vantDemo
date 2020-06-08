module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier', 'airbnb-base'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    plugins: ['prettier'],
    rules: {
        'linebreak-style': ['off', 'windows'],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // error
        'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        // warn
        'import/first': 'warn', // import 放在文件头
        'spaced-comment': 'warn', // 注释要含有空格
        camelcase: 'warn', // 驼峰命名
        'max-len': ['warn', { code: 150 }],
        'operator-assignment': 'warn',
        'prefer-destructuring': 'warn',
        'prefer-template': 'warn',
        'eol-last': 'warn',
        'object-curly-spacing': 'warn',
        'no-return-assign': 'warn',
        // off
        'no-underscore-dangle': 'off',
        'object-curly-newline': 'off',
        'comma-dangle': 'off',
        'no-restricted-syntax': 'off',
        radix: 'off',
        'consistent-return': 'off',
        'no-plusplus': 'off',
        'import/prefer-default-export': 'warn',
        'arrow-parens': 'off',
        indent: ['off', 1],
        'no-unused-vars': 1,
        'import/extensions': [
            'error',
            'always',
            {
                js: 'never',
                vue: 'never',
            },
        ],
        'prettier/prettier': 'off',
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: 'node_modules/@vue/cli-service/webpack.config.js',
            },
        },
    },
};
