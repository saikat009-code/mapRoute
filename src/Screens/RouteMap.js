import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const RouteMap = ({ route }) => {
  const { routeGeoJSON, startPoint, endPoint } = route.params;

  const mapRef = useRef(null);

  // Convert string coordinates to numbers
  const startLat = parseFloat(startPoint.LATITUDE);
  const startLng = parseFloat(startPoint.LONGITUDE);
  const endLat = parseFloat(endPoint.LATITUDE);
  const endLng = parseFloat(endPoint.LONGITUDE);

  // Convert GeoJSON coordinates to Polyline format
  const coordinates = routeGeoJSON.coordinates.map(coord => ({
    latitude: coord[1],
    longitude: coord[0],
  }));

  useEffect(() => {
    if (mapRef.current && coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
        animated: true,
      });
    }
  }, [coordinates]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        <Marker
          coordinate={{ latitude: startLat, longitude: startLng }}
          title="Start"
        />
        <Marker
          coordinate={{ latitude: endLat, longitude: endLng }}
          title="End"
        />
        <Polyline
          coordinates={coordinates}
          strokeColor="#1E90FF"
          strokeWidth={4}
        />
      </MapView>
    </View>
  );
};

export default RouteMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
