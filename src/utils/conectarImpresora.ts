import {useEffect, useState} from 'react';
import {NativeModules, NativeEventEmitter} from 'react-native';
import BleManager from 'react-native-ble-manager';

import {requestPermissions} from './requestPermissions';
import {IPeripheral} from '../entities/peripheral';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const conectarImpresora = () => {
  const peripherals = new Map<string, IPeripheral>();
  const [connectedDevices, setConnectedDevices] = useState<IPeripheral[]>([]);

  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals().then(results => {
      const peripheralsArray = results.map(peripheral => ({
        ...peripheral,
        connected: true,
      })) as IPeripheral[];
      peripheralsArray.forEach(peripheral =>
        peripherals.set(peripheral.id, peripheral),
      );
      setConnectedDevices(Array.from(peripherals.values()));
    });
  };

  useEffect(() => {
    const startBleManager = async () => {
      await requestPermissions();
      await BleManager.enableBluetooth();
      console.log('Bluetooth is turned on!');
      await BleManager.start({showAlert: false});
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    };
    startBleManager();

    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );

    let stopDisconnectListener = BleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      async ({peripheral, ...rest}) => {
        console.log('Disconnected from:', peripheral);

        // Intenta reconectar automáticamente aquí después de un breve intervalo
        setTimeout(async () => {
          try {
            await BleManager.connect(peripheral.id);
          } catch (error) {
            console.error('Error al intentar reconectar:', error);
          }
        }, 2000);
      },
    );

    return () => {
      stopConnectListener.remove();
      stopDisconnectListener.remove();
    };
  }, []);
  const impresora = connectedDevices.find(
    device => device.name == 'XXRBJ223101764',
  );

  return impresora;
};
