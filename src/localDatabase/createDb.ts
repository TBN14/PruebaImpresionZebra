// import SQLite, {SQLiteDatabase, Transaction} from 'react-native-sqlite-storage';
// import {
//   insertDataTable,
//   seeDataTable,
//   seeStructureTable,
//   createTable,
//   clearDb,
// } from '.';
// import {IUsuario, IAuto} from '../entities';

// export const createDb = async () => {
//   const db: SQLiteDatabase = await SQLite.openDatabase({name: 'PruebaDb2'});

//   try {
//     // await clearDb(db);

//     const usuarios: IUsuario[] = [
//       {
//         name: 'TEBAN14',
//         email: 'estban@gmail.com',
//         contacto: 'CACHI',
//         // direccion: 'prosoft',
//       },
//       {
//         name: 'CACHIRRITO',
//         email: 'cachi@gmail.com',
//         contacto: 'TEBAN',
//         // direccion: 'prosoft',
//       },
//     ];

//     const autos: IAuto[] = [
//       {
//         carro: 'Twingo',
//         modelo: '2005',
//         color: 'Plateado',
//         placa: 'BRN034',
//       },
//       {
//         carro: 'Kicks',
//         modelo: '2020',
//         color: 'Negro',
//         placa: 'FJS605',
//       },
//     ];

//     // Crear tablas
//     await Promise.all([
//       createTable(db, 'usuario', usuarios),
//       createTable(db, 'auto', autos),
//     ]);

//     // Verificar estructura de las tablas
//     await Promise.all([
//       seeStructureTable(db, 'usuario'),
//       seeStructureTable(db, 'auto'),
//     ]);

//     console.log('?????????????????????????');

//     // Insertar datos en las tablas
//     // for (const usuario of usuarios) {
//     //   await insertDataTable(db, 'usuario', usuario);
//     // }

//     // for (const auto of autos) {
//     //   await insertDataTable(db, 'auto', auto);
//     // }

//     // Verificar datos en las tablas
//     await seeDataTable(db, 'usuario');
//     await seeDataTable(db, 'auto');
//   } catch (error) {
//     console.error('Error durante la transacción:', error);
//   }
// };
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {
  seeStructureTable,
  createTable,
  seeDataTable,
  clearDb,
  insertDataTable,
} from '.';
import {IUsuario} from '../entities';

export const createDb = async () => {
  const db: SQLiteDatabase = await SQLite.openDatabase({name: 'PruebaDb14'});

  try {
    // await clearDb(db);
    // await seeStructureTable(db, 'usuario');
    // await seeDataTable(db, 'usuario');

    const usuarios: IUsuario[] = [
      {
        name: 'TEBAN',
        email: 'esteban@gmail.com',
        contacto: 'CACHI',
        direccion: 'prosoft',
        // sexo: 'gay',
        // raza: 'negro',
        // height: '1.73cm',
        // weight: '70kg',
        // id: '12345',
      },
    ];

    await createTable(db, 'usuario', usuarios);

    // Verificar estructura de las tablas
    // for (const usuario of usuarios) {
    //   await insertDataTable(db, 'usuario', usuario);
    // }
  } catch (error) {
    console.error('Error durante la transacción:', error);
  }
};
// debugger;
