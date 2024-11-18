import { useIsFocused } from '@react-navigation/native';
import {
    CameraIcon,
    FlashOffIcon,
    FlashOnIcon,
    PauseIcon,
    RecordIcon,
    RotateIcon,
    StartVideCaptureIcon,
    StopVideCaptureIcon,
    TorchOffIcon,
    TorchOnIcon,
} from '_assets/icons';
import PermissionsPage from '_components/Permissions';
import { useIsForeground } from '_hooks/useIsForeground';
import globalStyles from '_styles';
import { useRef, useState } from 'react';
import {
    Platform,
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
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
    const switchFlashStatus = () => {
        console.log('switchFlashStatus');
        setFlash(_f => !_f);
    };

    const {
        hasPermission: hasCameraPermission,
        requestPermission: requestCameraPermission,
    } = useCameraPermission();
    const {
        hasPermission: hasMicPermission,
        requestPermission: requestMicPermission,
    } = useMicrophonePermission();
    if (!hasCameraPermission || !hasMicPermission) {
        return (
            <PermissionsPage
                hasCameraPermission={hasCameraPermission}
                hasMicPermission={hasMicPermission}
                onRequestCameraPermission={requestCameraPermission}
                onRequestMicPermission={requestMicPermission}
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
            if (mode === 'Photo') {
                const _photo =
                    await cameraRef.current?.takePhoto(captureOptions);
                console.log('photo captured', _photo);
            } else if (mode === 'Video') {
                if (isRecording) {
                    await cameraRef.current?.stopRecording();
                    setIsRecording(false);
                } else {
                    cameraRef.current?.startRecording({
                        fileType: Platform.OS === 'ios' ? 'mov' : 'mp4',
                        videoCodec: 'h265',
                        flash: device?.hasFlash && flash ? 'on' : 'off',
                        onRecordingError: () => {
                            console.log('video recording error');
                        },
                        onRecordingFinished: () => {
                            console.log('video recording finished');
                        },
                        // path: ``,
                    });
                    setIsRecording(true);
                    console.log('video capturing');
                }
            }
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
                        audio={mode === 'Video'}
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
                {isRecording ? (
                    isRecordingPaused ? (
                        <RecordIcon />
                    ) : (
                        <PauseIcon />
                    )
                ) : allowPositionSwitching ? (
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
                    {mode === 'Photo' ? (
                        <CameraIcon />
                    ) : isRecording ? (
                        <StopVideCaptureIcon />
                    ) : (
                        <StartVideCaptureIcon />
                    )}
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
