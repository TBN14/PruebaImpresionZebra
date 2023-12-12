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
  const viewRef: any = useRef();

  const [loading, setLoading] = useState(false);
  const [loadingZebra, setLoadingZebra] = useState(false);
  const [image, setImage] = React.useState<ThumbnailResult | undefined>();
  const [xml, setXml] = React.useState<string>();

  const generarPDF = async () => {
    try {
      setLoading(true);
      let selectedHTML: IHTMLData = await htmlFactura();
      let file = await RNHTMLtoPDF.convert(selectedHTML);

      if (file.filePath) {
        // console.log('file.filePath :>> ', file.filePath);
        let pdf = await RNPrint.print({filePath: file.filePath});

        const result = await PdfThumbnail.generate(file.filePath, 0, 100);
        const imageData = await RNFS.readFile(result.uri, 'base64');

        const resizedImage = await ImageResizer.createResizedImage(
          result.uri,
          result.width,
          result.height,
          'PNG',
          100, // Calidad
        );

        setImage({...result, uri: resizedImage.uri});

        const xmlData = `
        <imageData>
          <uri>${resizedImage.uri}</uri>
          <width>${resizedImage.width}</width>
          <height>${resizedImage.height}</height>
          <!-- Otros campos si es necesario -->
        </imageData>
        `;
        setXml(xmlData);

        setLoading(false);
      } else {
        console.error(
          'Error: No se proporcionó un filePath después de convertir a PDF.',
        );
      }
    } catch (error) {
      console.error('Error al generar o imprimir PDF:', error);
    }
  };

  const generarZebraPDF = async () => {
    setTimeout(async () => {
      try {
        setLoadingZebra(true);
        let selectedHTML: IHTMLData = await htmlFactura();
        let file = await RNHTMLtoPDF.convert(selectedHTML);

        if (file.filePath) {
          console.log('impresora :>> ', impresora);
          console.log('image :>> ', image);
          if (impresora) {
            // const resizedImageData = await RNFS.readFile(image!.uri, 'base64');

            // console.log('imageHexa :>> ', imageHexa);
            // Datos para imprimir en formato ZPL
            // const zplData = `^XA^FO100,100^GFA,:${image?.uri}^FS^XZ`;
            // const zplData = '^XA^FO100,100^GB100,100,100^FS^XZ';
            // const zplData = `^XA^FO100,100^GB,2200,4000,300,${file.filePath}^FS^XZ`;
            // const zplData = `^XA^FO100,100^IME,:${image?.uri}^FS^XZ`;
            // const resizedImageData = await RNFS.readFile(image!.uri, 'base64');
            // const binaryData = Buffer.from(resizedImageData, 'base64');

            // const hexArray = Array.from(binaryData).map(byte =>
            //   byte.toString(16).padStart(2, '0'),
            // );
            // const hexString = hexArray.join('');

            // Datos para imprimir en formato ZPL con ~DG
            const zplData = `^XA^FO100,100^DG:image.GFA,200,400,${image?.uri}^FS^XZ`;

            // Imprimir en la impresora Zebra
            const imprimir = await printer.print(impresora.id, zplData);
            // const imprimir = await printer.print(impresora.id, xml);
            console.log('imprimir :>> ', imprimir);

            Alert.alert('Impresión exitosa');
            setLoadingZebra(false);
          } else {
            Alert.alert('Fallo buscando la impresora');
            setLoadingZebra(false);
          }
        } else {
          console.error(
            'Error: No se proporcionó un filePath después de convertir a PDF.',
          );
        }
      } catch (error) {
        console.error('Error al imprimir en la impresora Zebra:', error);
        setLoadingZebra(false);
        Alert.alert('Error al imprimir en la impresora Zebra');
      }
    }, 2000);
  };

  return (
    <View>
      <ViewShot
        ref={viewRef}
        // options={{result: 'base64', format: 'png', quality: 1}}
      >
        {image ? (
          <Image
            source={image}
            resizeMode="contain"
            style={{width: 200, height: 200, marginBottom: 20}}
          />
        ) : null}
      </ViewShot>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={generarPDF}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.scanButtonText}>Imprimir</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.scanButton}
        onPress={generarZebraPDF}
        disabled={loadingZebra}>
        {loadingZebra ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.scanButtonText}>Imprimir Zebra</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
