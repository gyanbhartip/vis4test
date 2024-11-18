import { NativeModules } from 'react-native';
const cameraRollFetcher = NativeModules.CameraRollFetcher;

export const parseAssetFromPhUri = async (uri: string) => {
    const imagePath: string | null =
        await cameraRollFetcher.saveToDocumentsFolder(uri);

    return imagePath;
};
