// @refresh reset
import { useNavigation } from '@react-navigation/native';
import { useImage } from '@shopify/react-native-skia';
import { globalStyles } from '_styles';
import { useCallback, useMemo, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import {
    Directions,
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { type CanvasControls, SketchiaCanvas } from 'sketchia';
import Controls, { type HighlightedColorOption } from './Controls';

type Props = {
    path?: string | null;
};

const CanvasComponent = ({ path }: Props) => {
    const windowDimensions = useWindowDimensions();

    const canvasRef = useRef<CanvasControls>(null);

    const image = useImage(path);

    const [currentColor, setCurrentColor] =
        useState<HighlightedColorOption>('#FCFCFC');

    const [isEditing, setIsEditing] = useState(false);

    const editHandler = useCallback(() => {
        setIsEditing(_s => {
            if (_s) {
                setCurrentColor('#FCFCFC');
            }
            return !_s;
        });
    }, []);

    const colorSelectHandler = useCallback(
        (c: HighlightedColorOption) => () => {
            setCurrentColor(c);
        },
        [],
    );

    const binHandler = useCallback(() => {
        canvasRef?.current?.clear();
    }, []);

    const undoHandler = useCallback(() => {
        canvasRef?.current?.undo();
    }, []);

    const [snapshot, setSnapshot] = useState<string | null>(null);

    const onSnapshot = useCallback(async () => {
        const _snapshot = canvasRef.current?.makeImageSnapshot();
        const uri = _snapshot?.uri;
        if (uri) {
            setSnapshot(uri);
            const _path = `${RNFS.DocumentDirectoryPath}/${path?.split('/').pop()}`;
            await RNFS.writeFile(_path, uri, 'base64');
        }
    }, [path]);

    const navigation = useNavigation();

    const flickDownGesture = useMemo(
        () =>
            Gesture.Fling()
                .direction(Directions.DOWN)
                .onEnd(() => {
                    runOnJS(navigation.goBack)();
                }),
        [navigation],
    );

    return (
        <View style={globalStyles.flex}>
            {snapshot ? (
                <GestureHandlerRootView style={globalStyles.flex}>
                    <GestureDetector gesture={flickDownGesture}>
                        <FastImage
                            style={{
                                width: windowDimensions.width,
                                height: windowDimensions.height,
                            }}
                            source={{ uri: snapshot }}
                        />
                    </GestureDetector>
                </GestureHandlerRootView>
            ) : (
                <>
                    <Controls
                        binHandler={binHandler}
                        colorSelectHandler={colorSelectHandler}
                        currentColor={currentColor}
                        editHandler={editHandler}
                        isEditing={isEditing}
                        onSnapshot={onSnapshot}
                        undoHandler={undoHandler}
                    />
                    <SketchiaCanvas
                        backgroundImage={image}
                        mode="quadratic"
                        ref={canvasRef}
                        strokeWeight={8}
                        toolColor={currentColor}
                        touchEnabled={isEditing}
                    />
                </>
            )}
        </View>
    );
};

export default CanvasComponent;
