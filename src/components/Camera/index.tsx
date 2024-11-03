import { useIsFocused } from '@react-navigation/native';
import {
    CameraIcon,
    FlashOffIcon,
    FlashOnIcon,
    RotateIcon,
    TorchOffIcon,
    TorchOnIcon,
    VideCaptureIcon,
} from '_assets/icons';
import PermissionsPage from '_components/Permissions';
import { useIsForeground } from '_hooks/useIsForeground';
import globalStyles from '_styles';
import React, { useRef, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    type ViewStyle,
} from 'react-native';
import {
    GestureHandlerRootView,
    PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {
    Camera,
    type CameraPosition,
    type TakePhotoOptions,
    useCameraDevice,
    useCameraPermission,
    useMicrophonePermission,
} from 'react-native-vision-camera';

type CameraComponentProps = {
    allowPositionSwitching?: boolean;
    mode?: 'Photo' | 'Video';
    position?: CameraPosition;
};

const CameraComponent = ({
    allowPositionSwitching = true,
    mode = 'Photo',
    position = 'back',
}: CameraComponentProps) => {
    const cameraRef = useRef<Camera>(null);

    const switchButtonRotation = useSharedValue(0);

    const [selectedDevice, setSelectedDevice] =
        useState<CameraPosition>(position);
    const device = useCameraDevice(selectedDevice);
    const switchCameraDevice = () => {
        console.log('switchCameraDevice');
        switchButtonRotation.value = withTiming(
            switchButtonRotation.value + 360,
            { duration: 500 },
        );
        setSelectedDevice(_d => (_d === 'back' ? 'front' : 'back'));
    };
    const switchButtonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${switchButtonRotation.value}deg` }],
    }));

    const isForeground = useIsForeground();
    const isFocused = useIsFocused();
    const isActive = isForeground && isFocused;

    const [flash, setFlash] = useState<boolean>(false);
    const switchFlashStatus = () => {
        console.log('switchFlashStatus');
        setFlash(_f => !_f);
    };

    const { hasPermission: hasCameraPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission } = useMicrophonePermission();
    if (!hasCameraPermission || !hasMicPermission) {
        return (
            <PermissionsPage
                hasCameraPermission={hasCameraPermission}
                hasMicPermission={hasMicPermission}
            />
        );
    }

    if (device == null) {
        return <Text style={globalStyles.warnText}>Device missing</Text>;
    }

    const captureOptions = {
        flash: device?.hasFlash && flash ? 'on' : 'off',
        enableShutterSound: false,
    } satisfies TakePhotoOptions;

    const onPressShutter = async () => {
        console.log('onPressShutter');
        try {
            const _photo = await cameraRef.current?.takePhoto(captureOptions);
            console.log('photo captured', _photo);
        } catch (error) {
            console.error('error in capturing photo', error);
        }
    };

    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PinchGestureHandler
                    // onGestureEvent={onPinchGesture}
                    enabled={true}>
                    <Camera
                        device={device}
                        isActive={isActive}
                        photo={mode === 'Photo'}
                        ref={cameraRef}
                        resizeMode="cover"
                        style={StyleSheet.absoluteFill}
                        video={mode === 'Video'}
                    />
                </PinchGestureHandler>
            </GestureHandlerRootView>
            <View style={styles.bottomButtonsContainer}>
                {allowPositionSwitching ? (
                    <Pressable
                        onPress={switchCameraDevice}
                        style={styles.smallButton}>
                        <Animated.View style={switchButtonAnimatedStyle}>
                            <RotateIcon />
                        </Animated.View>
                    </Pressable>
                ) : (
                    <View
                        style={[
                            styles.smallButton,
                            { backgroundColor: '#00000000' },
                        ]}
                    />
                )}
                <Pressable onPress={onPressShutter} style={styles.shutterIcon}>
                    {mode === 'Photo' ? <CameraIcon /> : <VideCaptureIcon />}
                </Pressable>
                <Pressable
                    onPress={switchFlashStatus}
                    style={styles.smallButton}>
                    {mode === 'Photo' ? (
                        flash ? (
                            <FlashOnIcon />
                        ) : (
                            <FlashOffIcon />
                        )
                    ) : flash ? (
                        <TorchOnIcon />
                    ) : (
                        <TorchOffIcon />
                    )}
                </Pressable>
            </View>
        </>
    );
};

export default CameraComponent;

type Styles = {
    bottomButtonsContainer: ViewStyle;
    shutterIcon: ViewStyle;
    smallButton: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
    bottomButtonsContainer: {
        alignItems: 'center',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 48,
        position: 'absolute',
        right: 0,
        width: '100%',
    },
    shutterIcon: {
        alignItems: 'center',
        borderColor: '#6e6e6e66',
        borderRadius: '50%',
        borderWidth: 4,
        justifyContent: 'center',
        padding: 2,
    },
    smallButton: {
        alignItems: 'center',
        backgroundColor: '#00000040',
        borderRadius: '50%',
        height: 36,
        justifyContent: 'center',
        width: 36,
    },
});
