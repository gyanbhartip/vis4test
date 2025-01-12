import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CanvasComponent from '_components/Canvas';
import type { RootStackParamList } from '_navigators/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SketchPad'>;

const SketchPad = (props: Props) => {
    const { imagePath } = props.route.params;
    return <CanvasComponent path={imagePath} />;
};

export default SketchPad;
