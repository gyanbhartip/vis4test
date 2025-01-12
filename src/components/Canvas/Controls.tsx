/* eslint-disable react-native/no-inline-styles */
import { BinIcon, EditIcon, UndoIcon } from '_assets/icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    binHandler: () => void;
    colorSelectHandler: (c: HighlightedColorOption) => () => void;
    currentColor: HighlightedColorOption;
    editHandler: () => void;
    isEditing: boolean;
    onSnapshot: () => Promise<void>;
    undoHandler: () => void;
};

const Controls = ({
    binHandler,
    colorSelectHandler,
    currentColor,
    editHandler,
    isEditing,
    onSnapshot,
    undoHandler,
}: Props) => {
    return (
        <>
            <TouchableOpacity
                onPress={onSnapshot}
                style={{
                    backgroundColor: 'lemonchiffon',
                    borderRadius: 24,
                    left: 8,
                    opacity: 0.65,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    position: 'absolute',
                    top: 12,
                    zIndex: 10,
                }}>
                <Text
                    style={{
                        color: 'black',
                        fontSize: 14,
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                    }}>
                    save
                </Text>
            </TouchableOpacity>
            <View style={styles.topButtonsContainer}>
                <TouchableOpacity onPress={binHandler} style={{ padding: 4 }}>
                    <BinIcon />
                </TouchableOpacity>
                <View
                    style={[
                        styles.editingContainer,
                        isEditing && {
                            backgroundColor: '#FCFCFC',
                        },
                    ]}>
                    <TouchableOpacity onPress={editHandler} style={{}}>
                        <EditIcon
                            fillOpacity={isEditing ? 1 : 0.5}
                            primaryColor={'#FCFCFC'}
                            secondaryColor={
                                currentColor === '#FCFCFC'
                                    ? '#3E4054'
                                    : currentColor
                            }
                        />
                    </TouchableOpacity>
                    {isEditing && (
                        <View style={{ gap: 4, marginTop: 4 }}>
                            {HighlightedColorOptions.map(_color => (
                                <TouchableOpacity
                                    key={_color}
                                    onPress={colorSelectHandler(_color)}
                                    style={[
                                        styles.colorContainer,
                                        {
                                            borderColor:
                                                currentColor === _color
                                                    ? _color === '#FCFCFC'
                                                        ? '#3E4054'
                                                        : _color
                                                    : 'transparent',
                                        },
                                    ]}>
                                    <View
                                        style={[
                                            styles.colorInner,
                                            { backgroundColor: _color },
                                        ]}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                {isEditing && (
                    <TouchableOpacity
                        onPress={undoHandler}
                        style={{ padding: 4 }}>
                        <UndoIcon />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
};

export default Controls;

const styles = StyleSheet.create({
    colorContainer: {
        alignItems: 'center',
        borderRadius: 32,
        borderWidth: 2,
        height: 30,
        justifyContent: 'center',
        padding: 4,
        width: 30,
    },
    colorInner: {
        borderColor: '#3E4054',
        borderRadius: 28,
        borderWidth: 0.5,
        height: 22,
        width: 22,
    },
    editingContainer: {
        padding: 4,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topButtonsContainer: {
        alignItems: 'center',
        gap: 4,
        justifyContent: 'center',
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
});

export const HighlightedColorOptions = [
    '#FDA000',
    '#4DBD58',
    '#F24242',
    '#8A41B9',
    '#FCFCFC',
    '#008CF0',
] as const;

export type HighlightedColorOption = (typeof HighlightedColorOptions)[number];
