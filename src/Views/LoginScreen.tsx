import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type LoginScreenProps = {
  navigation: StackNavigationProp<any, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const goToCreacionTabla = () => {
    navigation.navigate('CreacionTabla');
  };

  return (
    <View>
      <Text>Login</Text>
      {/* <TouchableOpacity onPress={goToCreacionTabla}> */}
      {/* <Text>Ir a Creación de Tabla</Text> */}
      {/* </TouchableOpacity> */}
    </View>
  );
};
