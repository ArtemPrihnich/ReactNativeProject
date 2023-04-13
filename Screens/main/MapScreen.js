import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = ({ route }) => {
  const location = {
    latitude: route.params.latitude,
    longitude: route.params.longitude,
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapContainer}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});
