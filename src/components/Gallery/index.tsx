import { type Album, CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { parseAssetFromPhUri } from '_utils/fetcher.ts';
import { useCallback, useState } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
type Props = {};

const GalleryComponent = (props: Props) => {
    const thumbnailSize = (useWindowDimensions().width - 48) / 2;
    const [albumList, setAlbumList] = useState<Array<AlbumWithUri>>([]);

    const fetchAlbumsList = useCallback(async () => {
        const albumList = (await CameraRoll.getAlbums(
            {},
        )) as Array<AlbumWithUri>;
        for (const album of albumList) {
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
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAlbumsList();
        }, [fetchAlbumsList]),
    );

    const flashListRenderItem = ({
        item: albumItem,
    }: {
        item: AlbumWithUri;
    }) => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: '#fafafa',
                    borderWidth: StyleSheet.hairlineWidth,
                    marginHorizontal: 8,
                    marginBottom: 16,
                }}>
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
                <Text
                    style={{
                        color: 'lightgrey',
                        fontSize: 14,
                        fontWeight: '600',
                    }}>
                    {albumItem.title}
                </Text>
            </View>
        );
    };

    return (
        <View
            style={{
                backgroundColor: 'darkred',
                flex: 1,
                paddingHorizontal: 8,
            }}>
            <Text
                style={{
                    color: 'white',
                    fontSize: 22,
                    fontWeight: 600,
                    marginLeft: 8,
                }}>
                Albums
            </Text>
            <FlashList
                contentContainerStyle={{}}
                data={albumList}
                numColumns={2}
                renderItem={flashListRenderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default GalleryComponent;

const styles = StyleSheet.create({});
export type AlbumWithUri = Album & { uri: string };
