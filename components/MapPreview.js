import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import ENV from '../env';

export default props => {
    let imagePreviewUrl;
    let location;
    if (props.location) {
        location = props.location;
    } else {
        location = useSelector(state => state.location.location);
    };
    if (location) {
        imagePreviewUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+fc9208(${location.longitude},${location.latitude})/${location.longitude},${location.latitude},12/400x170?access_token=${ENV.mapBoxToken}`;
    };
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={{ ...styles.mapPreview, ...props.style }}
        >
            {location
                ? <Image style={styles.mapImg} source={{ uri: imagePreviewUrl }} />
                : props.children
            }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    mapPreview: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapImg: {
        width: '100%',
        height: '100%'
    }
});