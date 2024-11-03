/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import RootNavigator from '_navigators/RootNavigator';
import type React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
} from 'react-native';

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaView
            style={[
                styles.backgroundStyle,
                isDarkMode ? styles.darkBg : styles.lightBg,
            ]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={
                    isDarkMode
                        ? styles.darkBg.backgroundColor
                        : styles.lightBg.backgroundColor
                }
            />
            <RootNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
    },
    darkBg: {
        backgroundColor: '#3f3f3f',
    },
    lightBg: {
        backgroundColor: '#a9a9a9',
    },
});

export default App;
