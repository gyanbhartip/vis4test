import {
    CameraRoll,
    type PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { galleryStyles } from '.';
import { getActualFilePath } from '_utils/fetcher';

type Props = {
    albumTitle: string;
};

const AlbumItems = ({ albumTitle }: Props) => {
    const thumbnailSize = (useWindowDimensions().width - 48) / 2;

    const [photos, setPhotos] = useState<Array<PhotoItem>>([]);

    useEffect(() => {
        CameraRoll.getPhotos({
            assetType: 'Photos',
            first: 20,
            groupName: albumTitle,
        }).then(_photos => {
            setPhotos(_photos.edges.map(_photo => _photo.node.image));
        });
    }, [albumTitle]);

    const navigation = useNavigation();
    const thumbnailOnpress = useCallback(
        (_imagePath: string) => () => {
            getActualFilePath(_imagePath).then(res => {
                navigation.navigate('SketchPad', {
                    imagePath: res.uri ?? '',
                });
            });
        },
        [navigation],
    );

    const flashListRenderItem = useCallback(
        ({ item: photoItem }: { item: PhotoItem }) => {
            return (
                <Pressable
                    style={galleryStyles.imageContainer}
                    onPress={thumbnailOnpress(photoItem.uri)}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        source={{
                            priority: FastImage.priority.normal,
                            uri: photoItem.uri,
                        }}
                        style={{
                            width: thumbnailSize,
                            height: thumbnailSize,
                        }}
                    />
                    <Text style={galleryStyles.albumTitle}>
                        {photoItem.filename}
                    </Text>
                </Pressable>
            );
        },
        [thumbnailSize, thumbnailOnpress],
    );
    return (
        <View style={galleryStyles.container}>
            <FlashList
                data={photos}
                estimatedItemSize={100}
                numColumns={2}
                renderItem={flashListRenderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default AlbumItems;

type PhotoItem = PhotoIdentifier['node']['image'];
