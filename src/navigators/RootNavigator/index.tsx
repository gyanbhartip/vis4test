import {
    type MaterialTopTabBarProps,
    createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { NavigationContainer, type RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationHeader from '_components/NavigationHeader';
import TabBarComponent from '_components/TabBar';
import type { RootStackParamList, TabParamList } from '_navigators/types';
import { CameraScreen, GalleryScreen } from '_screens';
import AlbumScreens from '_screens/AlbumScreens';
import SketchPad from '_screens/SketchPad';
import VideoScreen from '_screens/VideoScreen';
import { useWindowDimensions } from 'react-native';

const Tab = createMaterialTopTabNavigator<TabParamList>();

const renderTabBar = (props: MaterialTopTabBarProps) => (
    <TabBarComponent {...props} />
);

const TabNavigator = () => {
    const screenWidth = useWindowDimensions().width;
    return (
        <Tab.Navigator
            backBehavior="none"
            initialLayout={{ width: screenWidth }}
            initialRouteName="Camera"
            screenOptions={{ animationEnabled: true }}
            tabBar={renderTabBar}
            tabBarPosition="bottom">
            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{ lazy: true }}
            />
            <Tab.Screen
                name="Camera"
                component={CameraScreen}
                options={{ lazy: true }}
            />
            <Tab.Screen
                name="Video"
                component={VideoScreen}
                options={{ lazy: true }}
            />
        </Tab.Navigator>
    );
};

const navigatorOptions = ({
    route,
}: {
    route: RouteProp<RootStackParamList, keyof RootStackParamList>;
}) => ({
    headerTitle: (props: { children: string; tintColor?: string }) => (
        <NavigationHeader
            title={`${props.children}${route.params ? ` > ${Object.values(route.params).toString()}` : ''}`}
        />
    ),
});

const tabScreenOptions = ({
    route,
}: {
    route: RouteProp<RootStackParamList, 'Tabs'>;
}) => {
    return {
        // headerShown: route.name !== 'Tabs',
        headerShown: false,
    };
};

const RootNavigator = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={navigatorOptions}>
                <Stack.Screen
                    name="Tabs"
                    component={TabNavigator}
                    options={tabScreenOptions}
                />
                <Stack.Screen
                    name="SketchPad"
                    component={SketchPad}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="AlbumScreens" component={AlbumScreens} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
