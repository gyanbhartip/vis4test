module.exports = {
    root: true,
    extends: '@react-native',
    plugins: ['import'],
    settings: {
        'import/resolver': {
            node: {
                paths: ['src'],
                alias: {
                    _assets: './src/assets',
                    _components: './src/components',
                    _hooks: './src/hooks',
                    _navigators: './src/navigators',
                    _screens: './src/screens',
                    _styles: './src/styles',
                    _utils: './src/utils',
                },
            },
        },
    },
    rules: {
        'react/no-did-mount-set-state': 2,
        'react/no-direct-mutation-state': 2,
        semi: 2,
        'react/prop-types': 2,
        'react/jsx-no-bind': 2,
        'react/react-in-jsx-scope': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
};
