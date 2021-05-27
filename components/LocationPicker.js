import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Colors from '../constants/Colors';
import MapPreview from './MapPreview';
import Btn from './Btn';
import { useDispatch } from 'react-redux';
import { setLocation } from '../store/actions/location';

const LocationPicker = props => {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!pickedLocation) return;
    dispatch(setLocation(pickedLocation));
  }, [pickedLocation]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND, Permissions.LOCATION_BACKGROUND);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000
      });
      const deviceLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      setPickedLocation(deviceLocation);
    } catch (err) {
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }]
      );
      console.log(err);
    }
    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    props.navigate('Map');
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview
        style={styles.mapPreview}
        onPress={pickOnMapHandler}
      >
        {isFetching
          ? <ActivityIndicator size="large" color={Colors.primary} />
          : <Text>No location chosen yet!</Text>
        }
      </MapPreview>
      <View style={styles.actions}>
        <Btn
          title="Your Location"
          onPress={getLocationHandler}
        />
        <Btn
          title="Pick On Map"
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 30,
    alignItems: 'center'
  },
  mapPreview: {
    marginBottom: 10,
    width: '100%',
    height: 170,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
});

export default LocationPicker;
