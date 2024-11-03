import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

type Styles = {
    centerNoFlex: ViewStyle;
    flexCenter: ViewStyle;
    h1: TextStyle;
    warnText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
    centerNoFlex: {
        alignItems: 'center',
        justifyContent: 'center',
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

export default styles;
