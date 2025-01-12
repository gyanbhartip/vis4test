import { StyleSheet, Text } from 'react-native';

type Props = {
    title: string;
};

const NavigationHeader = ({ title }: Props) => {
    return <Text style={styles.title}>{title}</Text>;
};

export default NavigationHeader;

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
});
