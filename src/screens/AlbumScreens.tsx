import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AlbumItems from '_components/Gallery/AlbumItems.tsx';
import type { RootStackParamList } from '_navigators/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumScreens'>;

const AlbumScreens = (props: Props) => {
    const { albumTitle } = props.route.params;
    return <AlbumItems albumTitle={albumTitle} />;
};

export default AlbumScreens;
