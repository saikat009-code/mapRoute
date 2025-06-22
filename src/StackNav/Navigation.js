import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import RouteMap from '../Screens/RouteMap';
import LocationSearch from '../Screens/LocationSearch';
import Home from '../Screens/Home';


const Stack = createStackNavigator();
const mytheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
  },
};

const Navigation = () => {
  return (
    <NavigationContainer theme={mytheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="LocationSearch" component={LocationSearch} />
        <Stack.Screen name="RouteMap" component={RouteMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;