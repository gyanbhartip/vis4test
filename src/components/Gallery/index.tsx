import { CameraRoll, type Album } from '@react-native-camera-roll/camera-roll';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
type Props = {};

const GalleryComponent = (props: Props) => {
    const [albumList, setAlbumList] = useState<Array<AlbumWithUri>>([]);
    const fetchAlbumsList = async () => {
        const albumList = (await CameraRoll.getAlbums(
            {},
        )) as Array<AlbumWithUri>;
        for (const album of albumList) {
            const photo = await CameraRoll.getPhotos({
                first: 1,
                groupTypes: 'Album',
                groupName: album.title,
            });
            album.uri = photo.edges[0].node.image.uri;
        }
        setAlbumList(albumList);
    };
    useFocusEffect(
        useCallback(() => {
            fetchAlbumsList();
        }, []),
    );
    return (
        <View>
            <Text>GalleryComponent</Text>
        </View>
    );
};

export default GalleryComponent;

const styles = StyleSheet.create({});
export type AlbumWithUri = Album & { uri: string };
