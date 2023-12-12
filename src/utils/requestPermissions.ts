import {PermissionsAndroid} from 'react-native';

export const requestPermissions = async () => {
  const permissionsToRequest = [
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  ];

  for (const permission of permissionsToRequest) {
    try {
      const result = await PermissionsAndroid.request(permission);

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(`${permission} granted`);
      } else {
        console.log(`${permission} denied`);
      }
    } catch (error) {
      console.error(`Error al solicitar ${permission}:`, error);
    }
  }
  console.log('Todos los permisos han sido procesados');
};
