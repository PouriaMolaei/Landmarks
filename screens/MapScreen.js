import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { setLocation } from '../store/actions/location';

const MapScreen = props => {
  const placeDetailInit = props.navigation.getParam('initialLocation');
  const addPlaceInit = useSelector(state => state.location.location);
  let initialLocation;
  if (placeDetailInit) {
    initialLocation = placeDetailInit;
  } else {
    initialLocation = addPlaceInit;
  };

  const readOnly = props.navigation.getParam('readOnly');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const selectLocationHandler = event => {
    if (readOnly) return;
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    props.navigation.setParams({
      dispatch, location: selectedLocation
    });
  }, [selectedLocation]);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.latitude : 37.78,
    longitude: initialLocation ? initialLocation.longitude : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}
    >
      {selectedLocation &&
        <Marker
          title="Picked Location"
          coordinate={selectedLocation}
        />
      }
    </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  const { getParam } = navData.navigation;
  const dispatch = getParam('dispatch');
  const location = getParam('location');
  const readOnly = getParam('readOnly');
  if (readOnly) {
    return {
      headerTitle: 'Pick On Map',
    };
  };

  return {
    headerTitle: 'Pick On Map',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save Location"
          iconName={Platform.OS === 'android' ? 'md-save' : 'ios-save'}
          onPress={() => {
            navData.navigation.goBack();
            dispatch(setLocation(location));
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});

export default MapScreen;
