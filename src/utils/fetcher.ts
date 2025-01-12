import { NativeModules, Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const getActualFilePath = async (contentUri: string) => {
    if (Platform.OS === 'ios') {
        const cameraRollFetcher = NativeModules.CameraRollFetcher;
        const uri: string | null =
            await cameraRollFetcher.saveToDocumentsFolder(contentUri);
        return { uri, wasCopied: true };
    }

    if (!contentUri.startsWith('content://')) {
        return { uri: contentUri, wasCopied: false };
    }
    if (Platform.OS === 'android') {
        try {
            // First try to get the direct path
            const stats = await RNFS.stat(contentUri);
            return {
                uri: `file://${stats.originalFilepath}`,
                wasCopied: false,
            };
        } catch (error) {
            // If direct path fails, fall back to copying the file
            try {
                const destPath = `${RNFS.CachesDirectoryPath}/${Date.now()}.jpg`;
                await RNFS.copyFile(contentUri, destPath);
                return { uri: `file://${destPath}`, wasCopied: true };
            } catch (copyError) {
                console.error('Error handling file:', copyError);
                return { uri: contentUri, wasCopied: false };
            }
        }
    }
    return { uri: contentUri, wasCopied: false };
};
