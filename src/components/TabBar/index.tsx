import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Animated, Pressable, View } from 'react-native';

function TabBarComponent({
    state,
    descriptors,
    navigation,
    position,
}: MaterialTopTabBarProps) {
    return (
        <View
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 0,
                width: '100%',
            }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

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
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{
                            backgroundColor: isFocused ? '#6a6a32' : '#5a5a22',
                            borderColor: '#aeaeae',
                            borderLeftWidth: index === 0 ? 0 : 0.5,
                            flex: 1,
                            paddingVertical: 8,
                        }}>
                        <Animated.Text
                            style={{
                                opacity,
                                color: '#fafafa',
                                fontWeight: isFocused ? '600' : '400',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                            }}>
                            {label}
                        </Animated.Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default TabBarComponent;
