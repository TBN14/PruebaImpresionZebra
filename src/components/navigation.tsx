import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {CreateDbScreen, LoginScreen} from '../Views'; // Asegúrate de tener este componente

const Stack = createStackNavigator();

export const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CreacionDb">
        <Stack.Screen
          name="CreacionDb"
          component={CreateDbScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerLeft: () => null,
            headerTitle: 'Login',
            headerRight: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
