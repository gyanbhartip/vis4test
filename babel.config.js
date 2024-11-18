module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src/'],
                extensions: ['.js', '.ios.js', '.android.js', '.ts', '.tsx'],
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
        ],
        [
            'react-native-reanimated/plugin', // NOTE: Reanimated plugin has to be listed last.
        ],
    ],
    env: {
        production: {
            plugins: ['transform-remove-console'],
        },
    },
};
