import { type Album, CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { getActualFilePath } from '_utils/fetcher.ts';
import { useCallback, useState } from 'react';
import {
    PermissionsAndroid,
    Pressable,
    StyleSheet,
    Text,
    type TextStyle,
    View,
    type ViewStyle,
    useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const GalleryComponent = () => {
    const thumbnailSize = (useWindowDimensions().width - 48) / 2;
    const [albumList, setAlbumList] = useState<Array<AlbumWithThumbnail>>([]);

    const fetchAlbumsList = useCallback(async () => {
        const hasPermission = await PermissionsAndroid.check(
            'android.permission.READ_MEDIA_IMAGES',
        );

        if (!hasPermission) {
            await PermissionsAndroid.request(
                'android.permission.READ_MEDIA_IMAGES',
            );
        }
        const _albumList = (await CameraRoll.getAlbums({
            assetType: 'All',
        })) as Array<AlbumWithThumbnail>;

        for (const album of _albumList) {
            const photo = await CameraRoll.getPhotos({
                first: 1,
                groupTypes: 'Album',
                groupName: album.title,
            });
            album.thumbnailUri =
                (await getActualFilePath(photo.edges[0].node.image.uri)).uri ||
                '';
        }
        setAlbumList(_albumList);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAlbumsList();
        }, [fetchAlbumsList]),
    );

    const navigation = useNavigation();

    const handleAlbumPress = useCallback(
        (album: AlbumWithThumbnail) => () => {
            navigation.navigate('AlbumScreens', {
                albumTitle: album.title,
            });
        },
        [navigation],
    );

    const flashListRenderItem = useCallback(
        ({ item: albumItem }: { item: AlbumWithThumbnail }) => {
            return (
                <Pressable
                    style={styles.imageContainer}
                    onPress={handleAlbumPress(albumItem)}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                            priority: FastImage.priority.normal,
                            uri: albumItem.thumbnailUri,
                        }}
                        style={{
                            width: thumbnailSize,
                            height: thumbnailSize,
                        }}
                    />
                    <Text style={styles.albumTitle}>{albumItem.title}</Text>
                </Pressable>
            );
        },
        [handleAlbumPress, thumbnailSize],
    );

    return (
        <View style={styles.container}>
            <FlashList
                data={albumList}
                estimatedItemSize={100}
                numColumns={2}
                renderItem={flashListRenderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default GalleryComponent;

type Styles = {
    albumTitle: TextStyle;
    container: ViewStyle;
    header: TextStyle;
    imageContainer: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
    albumTitle: {
        color: 'lightgrey',
        fontSize: 14,
        fontWeight: '600',
    },
    container: {
        backgroundColor: 'darkred',
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    header: {
        color: 'white',
        fontSize: 22,
        fontWeight: 600,
        marginLeft: 8,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fafafa',
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 8,
        marginBottom: 16,
    },
});
type AlbumWithThumbnail = Album & { thumbnailUri: string };

export { styles as galleryStyles };
