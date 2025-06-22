// screens/LocationSearchScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { moderateScale, verticalScale } from 'react-native-size-matters';

export default function LocationSearch({ navigation, route }) {
  const { type, onSelect } = route.params;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async val => {
    setQuery(val);
    if (val.length < 3) return;
    const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${val}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    try {
      const res = await axios.get(url);
      setResults(res.data.results);
    } catch (error) {
      console.error('Search Error:', error);
    }
  };

  const handleSelect = location => {
    onSelect(location);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainCon}>
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder="Search location..."
          style={styles.input}
        />
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={styles.item}
            >
              <Text>{item.SEARCHVAL}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  mainCon: {
    marginHorizontal: moderateScale(20),
    marginTop: Platform.OS === 'android' ?  verticalScale(40) : verticalScale(20),
    marginBottom: moderateScale(10),
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
  },
  item: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});
