import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import type { NavigationRoute, ParamListBase } from '@react-navigation/native';
import { globalStyles } from '_styles';
import {
    Animated,
    Pressable,
    StyleSheet,
    View,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

const TabBarComponent = ({
    state,
    descriptors,
    navigation,
    position,
}: MaterialTopTabBarProps) => {
    const onPress =
        (route: NavigationRoute<ParamListBase, string>, isFocused: boolean) =>
        () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
            }
        };

    const onLongPress =
        (route: NavigationRoute<ParamListBase, string>) => () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
        };

    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                          ? options.title
                          : route.name;

                const isFocused = state.index === index;

                const inputRange = state.routes.map((_, i) => i);
                const opacity = position.interpolate({
                    inputRange,
                    outputRange: inputRange.map(i => (i === index ? 1 : 0.75)),
                });

                return (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        key={`${label}`}
                        // testID={options.tabBarTestID}
                        onPress={onPress(route, isFocused)}
                        onLongPress={onLongPress(route)}
                        style={[
                            styles.tabContainer,
                            isFocused ? styles.focussedBG : styles.unfocussedBG,
                            index !== 0 && styles.addBorder,
                        ]}>
                        <Animated.Text
                            style={[
                                {
                                    opacity,
                                },
                                isFocused && globalStyles.boldText,
                                styles.tabText,
                            ]}>
                            {label}
                        </Animated.Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

export default TabBarComponent;

type Styles = {
    addBorder: ViewStyle;
    container: ViewStyle;
    focussedBG: ViewStyle;
    tabContainer: ViewStyle;
    tabText: TextStyle;
    unfocussedBG: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
    addBorder: {
        borderLeftWidth: 0.5,
    },
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 0,
        width: '100%',
    },
    focussedBG: {
        backgroundColor: '#6a6a32',
    },
    tabContainer: {
        borderColor: '#aeaeae',
        flex: 1,
        paddingVertical: 8,
    },
    tabText: {
        color: '#fafafa',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    unfocussedBG: {
        backgroundColor: '#5a5a22',
    },
});
