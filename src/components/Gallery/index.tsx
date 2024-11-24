import { CameraRoll, type Album } from '@react-native-camera-roll/camera-roll';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { parseAssetFromPhUri } from '_utils/fetcher.ts';
import { useCallback, useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
    type TextStyle,
    type ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const GalleryComponent = () => {
    const thumbnailSize = (useWindowDimensions().width - 48) / 2;
    const [albumList, setAlbumList] = useState<Array<AlbumWithUri>>([]);

    const fetchAlbumsList = useCallback(async () => {
        const _albumList = (await CameraRoll.getAlbums(
            {},
        )) as Array<AlbumWithUri>;

        for (const album of _albumList) {
            const photo = await CameraRoll.getPhotos({
                first: 1,
                groupTypes: 'Album',
                groupName: album.title,
            });

            if (Platform.OS === 'ios') {
                album.uri =
                    (await parseAssetFromPhUri(
                        photo.edges[0].node.image.uri,
                    )) || '';
            } else if (Platform.OS === 'android') {
                album.uri = photo.edges[0].node.image.uri;
            }
        }
        setAlbumList(albumList);
    }, [albumList]);

    useFocusEffect(
        useCallback(() => {
            fetchAlbumsList();
        }, [fetchAlbumsList]),
    );

    const flashListRenderItem = useCallback(
        ({ item: albumItem }: { item: AlbumWithUri }) => {
            return (
                <View style={styles.imageContainer}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                            priority: FastImage.priority.normal,
                            uri: albumItem.uri,
                        }}
                        style={{
                            width: thumbnailSize,
                            height: thumbnailSize,
                        }}
                    />
                    <Text style={styles.albumTitle}>{albumItem.title}</Text>
                </View>
            );
        },
        [thumbnailSize],
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Albums</Text>
            <FlashList
                contentContainerStyle={{}}
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
export type AlbumWithUri = Album & { uri: string };
