import { NativeModules, Platform } from 'react-native';

export const parseAssetFromPhUri = async (uri: string) => {
    if (Platform.OS === 'ios') {
        const cameraRollFetcher = NativeModules.CameraRollFetcher;
        const imagePath: string | null =
            await cameraRollFetcher.saveToDocumentsFolder(uri);
        return imagePath;
    }
};
