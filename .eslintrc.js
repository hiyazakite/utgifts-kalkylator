module.exports = {
    extends: ['mantine'],
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: ['flowtype'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'flowtype/define-flow-type': 1,
        'flowtype/use-flow-type': 1
    },
};
