import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

type Styles = {
    bgTransparent: ViewStyle;
    boldText: TextStyle;
    centerNoFlex: ViewStyle;
    flex: ViewStyle;
    flexCenter: ViewStyle;
    h1: TextStyle;
    warnText: TextStyle;
};

export const globalStyles = StyleSheet.create<Styles>({
    bgTransparent: {
        backgroundColor: '#00000000',
    },
    boldText: {
        fontWeight: 600,
    },
    centerNoFlex: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex: {
        flex: 1,
    },
    flexCenter: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    h1: {
        color: '#0E0E0E',
        fontSize: 24,
        fontWeight: 600,
    },
    warnText: {
        color: '#FD4A0A',
        textTransform: 'uppercase',
    },
});
