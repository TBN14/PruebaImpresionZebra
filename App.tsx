import React from 'react';
import {StatusBar, SafeAreaView, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {styles} from './styles/styles';
import {Navigation} from './src/components/navigation';
import {ManagerDevices} from './src/components/ManagerDevices';
import {GeneratorPDF} from './src/components/GeneratorPdf';
import {conectarImpresora} from './src/utils/conectarImpresora';
import {LocalDb} from './src/localDatabase/LocalDb';

const App = () => {
  // const conexion = conectarImpresora();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Navigation />
      {/* <LocalDb /> */}
      {/* <GeneratorPDF /> */}
      {/* <ManagerDevices /> */}
    </SafeAreaView>
  );
};

export default App;
