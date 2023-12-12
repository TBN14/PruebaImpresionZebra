import {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
// import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';

import {requestPermissions} from '../utils/requestPermissions';
import {IPeripheral} from '../entities/peripheral';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {styles} from '../../styles/styles';
import {DeviceList} from './DeviceList';
import {GeneratorPDF} from './GeneratorPdf';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// const printer: any = RNZebraBluetoothPrinter;

export const ManagerDevices = () => {
  const peripherals = new Map<string, IPeripheral>();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<IPeripheral[]>([]);
  const [discoveredDevices, setDiscoveredDevices] = useState<IPeripheral[]>([]);
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
  const impresora = connectedDevices.find(
    device => device.name == 'XXRBJ223101764',
  );

  useEffect(() => {
    let reconnectInterval: any;

    const startBleManager = async () => {
      await requestPermissions();
      await BleManager.enableBluetooth();
      console.log('Bluetooth is turned on!');
      await BleManager.start({showAlert: false});
      console.log('BleManager initialized');
      handleGetConnectedDevices();

      reconnectInterval = setInterval(() => {
        if (impresora && !impresora.connected) {
          reconnectPrinter(impresora.id);
        }
      }, 10000);
    };
    startBleManager();

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );
    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );
    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();

      clearInterval(reconnectInterval);
    };
  }, [impresora]);

  const startScan = () => {
    if (!isScanning) {
      console.log('Entre');
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.log(error);
          console.error(error);
        });
    }
  };

  const reconnectPrinter = async (peripheralId: string) => {
    try {
      await BleManager.connect(peripheralId);
    } catch (error) {
      console.error('Error al intentar reconectar:', error);
    }
  };

  const connectToPeripheral = (peripheral: IPeripheral) => {
    BleManager.createBond(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        console.log('failed to bond');
      });
  };

  const disconnectFromPeripheral = (peripheral: IPeripheral) => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('fail to remove the bond');
      });
  };

  const printLabelToZebraPrinter = async () => {
    try {
      // Dirección MAC de tu impresora Zebra
      //   const printerAddress = 'F4:60:77:19:90:AC'; // Reemplaza con la dirección correcta
      const printerAddress = connectedDevices[0].id; // Reemplaza con la dirección correcta

      // Datos para imprimir (puedes personalizar según tus necesidades)
      const labelData = '^XA^FO100,100^FDTEBAN^FS^XZ';
      const imageData = {
        height: 1099,
        uri: 'file:///data/user/0/com.pruebaconexionbluetooth/cache/TEBAN-pdf-thumbnail-0-16575996417487263633285356150.jpg',
        width: 550,
      };

      // Imprimir ZPL
      // await printer.print(printerAddress, labelData);
      // Imprimir Imagen
      await printer.print(printerAddress, imageData);

      Alert.alert('Impresión exitosa');
    } catch (error) {
      console.error('Error al imprimir en la impresora Zebra:', error);
      Alert.alert('Error al imprimir en la impresora Zebra');
    }
  };

  // return connectedDevices;

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{paddingHorizontal: 20}}>
      <Text
        style={[
          styles.title,
          {color: isDarkMode ? Colors.white : Colors.black},
        ]}>
        React Native BLE Manager Tutorial
      </Text>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.scanButton}
        onPress={startScan}>
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
        </Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.subtitle,
          {color: isDarkMode ? Colors.white : Colors.black},
        ]}>
        Discovered Devices:
      </Text>
      {discoveredDevices.length > 0 ? (
        <FlatList
          data={discoveredDevices}
          renderItem={({item}) => (
            <DeviceList
              peripheral={item}
              connect={connectToPeripheral}
              disconnect={disconnectFromPeripheral}
            />
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
      )}
      <Text
        style={[
          styles.subtitle,
          {color: isDarkMode ? Colors.white : Colors.black},
        ]}>
        Connected Devices:
      </Text>
      {connectedDevices.length > 0 ? (
        <FlatList
          data={connectedDevices}
          renderItem={({item}) => (
            <DeviceList
              peripheral={item}
              connect={connectToPeripheral}
              disconnect={disconnectFromPeripheral}
            />
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noDevicesText}>No connected devices</Text>
      )}
      {/* <TouchableOpacity
        activeOpacity={0.5}
        style={styles.scanButton}
        onPress={printLabelToZebraPrinter}>
        <Text style={styles.scanButtonText}>Print Label to Zebra Printer</Text>
      </TouchableOpacity>
      // <GeneratorPDF /> */}
    </View>
  );
};
