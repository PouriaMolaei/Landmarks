import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default props => {
    return (
        <View style={styles.btn}>
            <Button
                title={props.title}
                color={Colors.primary}
                onPress={props.onPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    btn: {
        width: 125
    }
});