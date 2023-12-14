import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import PdfThumbnail, {type ThumbnailResult} from 'react-native-pdf-thumbnail';
import ImageResizer from 'react-native-image-resizer';
import {Buffer} from 'buffer';
// import {decode} from 'base-64';

import {styles} from '../../styles/styles';
import {conectarImpresora} from '../utils/conectarImpresora';
import {htmlFactura} from '../utils/htmlFactura';
import {
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import {useState} from 'react';
import React, {useRef} from 'react';
import {zplFactura} from '../utils/zplFactura';

interface IHTMLData {
  html: string;
  fileName: string;
  directory: string;
  base64: boolean;
  height?: number;
  width?: number;
}

const printer: any = RNZebraBluetoothPrinter;

export const GeneratorPDF = () => {
  const impresora = conectarImpresora();

  const [loading, setLoading] = useState(false);

  const generarZebraPDF = async () => {
    try {
      setLoading(true);
      const zplData = await zplFactura();
      console.log('zplData :>> ', zplData);
      if (impresora && zplData) {
        // Imprimir en la impresora Zebra
        const imprimir = await printer.print(impresora.id, zplData);
        console.log('imprimir :>> ', imprimir);

        setLoading(false);
      } else {
        Alert.alert('Fallo buscando la impresora');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al imprimir en la impresora Zebra:', error);
      setLoading(false);
      Alert.alert('Error al imprimir en la impresora Zebra');
    }
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.scanButton}
        onPress={generarZebraPDF}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.scanButtonText}>Imprimir Zebra</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
