import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {createDb} from '../localDatabase/index';
import {allFunctions} from '../localDatabase/allFunctions';

type CreateDbScreenProps = {
  navigation: StackNavigationProp<any, 'CreacionDb'>;
};

export const CreateDbScreen: React.FC<CreateDbScreenProps> = ({navigation}) => {
  useEffect(() => {
    // createDb();
    allFunctions();
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  }, []);

  return (
    <View>
      <View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{
            width: 200,
            height: 200,
            resizeMode: 'contain',
          }}
          source={require('../../assets/Pensador.png')}
        />
      </View>
    </View>
  );
};
