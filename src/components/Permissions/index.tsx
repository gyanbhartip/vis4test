import globalStyles from '_styles';
import React from 'react';
import {
    PermissionsAndroid,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    type TextStyle,
    View,
    type ViewStyle,
} from 'react-native';

type Props = {
    hasCameraPermission: boolean;
    hasMicPermission?: boolean;
};

const PermissionsPage = ({ hasCameraPermission, hasMicPermission }: Props) => {
    const requestPermissionHandler = async () => {
        !hasCameraPermission &&
            (await PermissionsAndroid.request('android.permission.CAMERA'));
        !hasMicPermission &&
            (await PermissionsAndroid.request(
                'android.permission.RECORD_AUDIO',
            ));
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.heading}>missing permissions</Text>
                <View style={styles.missingPermissionsList}>
                    {!hasCameraPermission && (
                        <Text style={globalStyles.warnText}>&bull; camera</Text>
                    )}
                    {!hasMicPermission && (
                        <Text style={globalStyles.warnText}>
                            &bull; microphone
                        </Text>
                    )}
                </View>
                <View style={globalStyles.centerNoFlex}>
                    <Pressable
                        onPress={requestPermissionHandler}
                        style={({ pressed }) => [
                            styles.button,
                            {
                                opacity: pressed ? 0.65 : 1,
                            },
                        ]}>
                        <Text style={styles.buttonText}>
                            request permission
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PermissionsPage;

type Styles = {
    button: ViewStyle;
    buttonText: TextStyle;
    container: ViewStyle;
    heading: TextStyle;
    innerContainer: ViewStyle;
    missingPermissionsList: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
    button: {
        alignItems: 'center',
        backgroundColor: '#0AAD5E',
        borderRadius: 6,
        boxShadow: [
            {
                offsetX: -2,
                offsetY: 2,
                blurRadius: 5,
                spreadDistance: 0,
                color: 'rgba(24, 0, 32, 0.25)',
            },
        ],
        justifyContent: 'center',
        paddingVertical: 12,
        width: '50%',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 800,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    heading: {
        ...globalStyles.h1,
        textTransform: 'uppercase',
    },
    innerContainer: {
        backgroundColor: '#b9b9b988',
        borderColor: '#18002040',
        borderRadius: 6,
        borderWidth: 1,
        boxShadow: [
            {
                offsetX: 0,
                offsetY: 1,
                blurRadius: 5,
                spreadDistance: 0,
                color: 'rgba(24, 0, 32, 0.55)',
            },
        ],
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 18,
    },
    missingPermissionsList: {
        marginBottom: 48,
        marginTop: 16,
        paddingStart: 16,
    },
});
