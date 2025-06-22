// screens/RouteInputScreen.js
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Colors from '../themes/Colors';

export default function Home({ route }) {
  const navigation = useNavigation();
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.location && route.params?.type) {
      if (route.params.type === 'start') {
        setStartPoint(route.params.location);
      } else {
        setEndPoint(route.params.location);
      }
    }
  }, [route.params]);

  const handleFindRoute = async () => {
    if (!startPoint) {
      Alert.alert('Please select a start location.');
      return;
    } else if (!endPoint) {
      Alert.alert('Please select an end location.');
      return;
    }
    const startLat = parseFloat(startPoint.LATITUDE);
    const startLng = parseFloat(startPoint.LONGITUDE);
    const endLat = parseFloat(endPoint.LATITUDE);
    const endLng = parseFloat(endPoint.LONGITUDE);

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    console.log('Fetching from URL:', url);

    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();

      console.log('Full response:', JSON.stringify(data));

      if (!data.routes || data.routes.length === 0) {
        console.log('No route found');
        Alert.alert('Error', 'No route found for the selected locations.');
        return;
      }

      const route = data.routes[0];

      navigation.navigate('RouteMap', {
        routeGeoJSON: route.geometry,
        startPoint,
        endPoint,
      });
    } catch (error) {
      console.log('Error fetching route:', error.message);
      Alert.alert('Network Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainCon}>
        <TouchableOpacity
          style={styles.input}
          onPress={() =>
            navigation.navigate('LocationSearch', {
              type: 'start',
              onSelect: location => setStartPoint(location),
            })
          }
        >
          <Text style={styles.inputText}>
            {startPoint?.SEARCHVAL || 'Select start Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() =>
            navigation.navigate('LocationSearch', {
              type: 'end',
              onSelect: location => setEndPoint(location),
            })
          }
        >
          <Text style={styles.inputText}>
            {endPoint?.SEARCHVAL || 'Select end Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFindRoute} style={styles.btn}>
          {loading ? (
            <Text style={styles.btnTxt}>Loading...</Text>
          ) : (
            <Text style={styles.btnTxt}>Find Route</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  input: {
    borderWidth: scale(1),
    borderColor: '#999',
    padding: moderateScale(12),
    borderRadius: moderateScale(5),
    marginBottom: verticalScale(12),
  },
  mainCon: {
    marginHorizontal: moderateScale(20),
    marginTop:
      Platform.OS === 'android' ? verticalScale(40) : verticalScale(20),
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: moderateScale(12),
    borderRadius: scale(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
  },
  btnTxt: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  inputText: {
    fontSize: scale(14),
    color: Colors.gray,
  },
});
