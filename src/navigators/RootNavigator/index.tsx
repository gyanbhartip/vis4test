import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TabBarComponent from '_components/TabBar';
import type { RootStackParamList } from '_navigators/types';
import { CameraScreen, GalleryScreen } from '_screens';
import VideoScreen from '_screens/VideoScreen';
import { useWindowDimensions } from 'react-native';

const RootNavigator = () => {
    const Tab = createMaterialTopTabNavigator<RootStackParamList>();
    const screenWidth = useWindowDimensions().width;
    return (
        <NavigationContainer>
            <Tab.Navigator
                backBehavior="none"
                initialLayout={{
                    width: screenWidth,
                }}
                initialRouteName="Camera"
                screenOptions={{ animationEnabled: true }}
                tabBar={props => <TabBarComponent {...props} />}
                tabBarPosition="bottom">
                <Tab.Screen
                    name="Gallery"
                    component={GalleryScreen}
                    options={{ lazy: true }}
                />
                <Tab.Screen
                    name="Camera"
                    component={CameraScreen}
                    options={{ lazy: false }}
                />
                <Tab.Screen
                    name="Video"
                    component={VideoScreen}
                    options={{ lazy: true }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
