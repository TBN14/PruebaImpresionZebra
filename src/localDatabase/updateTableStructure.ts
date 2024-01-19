// import {SQLiteDatabase} from 'react-native-sqlite-storage';
// import {seeStructureTable} from '.';

// export const updateTableStructure = async (
//   db: SQLiteDatabase,
//   tableName: string,
//   newColumns: string[],
//   existingColumns: string[],
// ): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     // Verificar si la tabla existe
//     const tableExistsQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`;

//     db.transaction(tx => {
//       tx.executeSql(
//         tableExistsQuery,
//         [],
//         async (_, result) => {
//           if (result.rows.length > 0) {
//             // La tabla ya existe, crear una versión temporal de la tabla
//             const tempTableName = `${tableName}_temp`;

//             // Filtrar las columnas existentes que también están presentes en las nuevas columnas
//             const filteredColumnsDefinition = newColumns
//               .filter(prop => existingColumns.includes(prop))
//               .map(prop => `${prop}`)
//               .join(', ');

//             // Verificar si hay al menos una columna en la definición de la tabla temporal
//             if (filteredColumnsDefinition) {
//               // Crear una nueva tabla temporal solo con las columnas existentes
//               const createTempTableQuery = `
//                 CREATE TABLE IF NOT EXISTS ${tempTableName} (${filteredColumnsDefinition});
//               `;
//               tx.executeSql(
//                 createTempTableQuery,
//                 [],
//                 async (_, createTempTableResult) => {
//                   // Insertar datos desde la tabla existente a la tabla temporal
//                   const insertDataQuery = `
//                     INSERT INTO ${tempTableName} (${filteredColumnsDefinition})
//                     SELECT ${filteredColumnsDefinition} FROM ${tableName};
//                   `;

//                   tx.executeSql(
//                     insertDataQuery,
//                     [],
//                     async (_, insertDataResult) => {
//                       // Renombrar la tabla existente a una versión antigua
//                       const renameTableQuery = `ALTER TABLE ${tableName} RENAME TO ${tableName}_old;`;

//                       tx.executeSql(
//                         renameTableQuery,
//                         [],
//                         async (_, renameTableResult) => {
//                           // Renombrar la tabla temporal al nombre original
//                           const renameTempTableQuery = `ALTER TABLE ${tempTableName} RENAME TO ${tableName};`;

//                           tx.executeSql(
//                             renameTempTableQuery,
//                             [],
//                             async (_, renameTempTableResult) => {
//                               console.log(
//                                 `Transferencia de datos entre tabla original y antigua completada con éxito`,
//                               );

//                               const arrayNewColumnsAdd = newColumns.filter(
//                                 prop => !existingColumns.includes(prop),
//                               );

//                               if (arrayNewColumnsAdd.length > 0) {
//                                 for (
//                                   let i = 0;
//                                   i < arrayNewColumnsAdd.length;
//                                   i++
//                                 ) {
//                                   let newColumnAdd = arrayNewColumnsAdd[i];
//                                   newColumnAdd = `${newColumnAdd} TEXT`;

//                                   const alterTableQuery = `ALTER TABLE ${tableName} ADD COLUMN ${newColumnAdd};`;

//                                   tx.executeSql(
//                                     alterTableQuery,
//                                     [],
//                                     async (_, alterTableResult) => {
//                                       console.log(
//                                         `Nuevas columnas añadidas a la tabla "${tableName}_temp" con éxito`,
//                                       );
//                                     },
//                                     error => {
//                                       console.log(
//                                         `Error al agregar nuevas columnas a la tabla "${tableName}_temp":`,
//                                         error,
//                                       );
//                                     },
//                                   );
//                                 }
//                               }

//                               const dropOldTableQuery = `DROP TABLE IF EXISTS ${tableName}_old;`;

//                               tx.executeSql(
//                                 dropOldTableQuery,
//                                 [],
//                                 async (_, dropOldTableResult) => {
//                                   console.log(
//                                     `Tabla "${tableName}_old" eliminada con éxito`,
//                                   );
//                                   await Promise.all([
//                                     seeStructureTable(db, 'usuario'),
//                                   ]);
//                                   resolve();
//                                 },
//                                 error => {
//                                   console.log(
//                                     `Error al eliminar la tabla "${tableName}_old":`,
//                                     error,
//                                   );
//                                 },
//                               );
//                             },
//                             error => {
//                               console.log(
//                                 `Error al renombrar la tabla temporal a ${tableName}:`,
//                                 error,
//                               );
//                             },
//                           );
//                         },
//                         error => {
//                           console.log(
//                             `Error al renombrar la tabla existente a ${tableName}_old:`,
//                             error,
//                           );
//                         },
//                       );
//                     },
//                     error => {
//                       console.log(
//                         `Error al insertar datos en la tabla temporal ${tempTableName}:`,
//                         error,
//                       );
//                     },
//                   );
//                 },
//                 error => {
//                   console.log(
//                     `Error al crear la tabla temporal ${tempTableName}:`,
//                     error,
//                   );
//                 },
//               );
//             } else {
//               console.log(
//                 `Error: La definición de la tabla temporal "${tempTableName}" no contiene columnas.`,
//               );
//             }
//           } else {
//             console.log(`La tabla "${tableName}" no existe.`);
//           }
//         },
//         error => {
//           console.log(
//             `Error al verificar la existencia de la tabla "${tableName}":`,
//             error,
//           );
//         },
//       );
//     });
//   });
// };

import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {seeDataTable, seeStructureTable} from '.';

export const updateTableStructure = async (
  db: SQLiteDatabase,
  tableName: string,
  newColumns: string[],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verificar si la tabla existe
    const tableExistsQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`;

    db.transaction(tx => {
      tx.executeSql(
        tableExistsQuery,
        [],
        async (_, result) => {
          if (result.rows.length > 0) {
            // La tabla ya existe, agregar las nuevas columnas
            const existingColumnsQuery = `PRAGMA table_info(${tableName});`;

            tx.executeSql(
              existingColumnsQuery,
              [],
              async (_, existingColumnsResult) => {
                const existingColumns = Array.from(
                  {length: existingColumnsResult.rows.length},
                  (_, index) => existingColumnsResult.rows.item(index).name,
                );

                const columnsToAdd = newColumns.filter(
                  prop => !existingColumns.includes(prop),
                );

                if (columnsToAdd.length > 0) {
                  for (let i = 0; i < columnsToAdd.length; i++) {
                    let newColumnAdd = columnsToAdd[i];
                    newColumnAdd = `${newColumnAdd} TEXT`; // Puedes ajustar el tipo de datos según tus necesidades

                    const alterTableQuery = `ALTER TABLE ${tableName} ADD COLUMN ${newColumnAdd} DEFAULT ' ';`;

                    tx.executeSql(
                      alterTableQuery,
                      [],
                      async (_, alterTableResult) => {
                        console.log(
                          `Nueva columna "${newColumnAdd}" añadida a la tabla "${tableName}" con éxito`,
                        );
                        await Promise.all([
                          seeStructureTable(db, tableName),
                          seeDataTable(db, 'usuario'),
                        ]);
                      },
                      error => {
                        console.log(
                          `Error al agregar la nueva columna "${newColumnAdd}" a la tabla "${tableName}":`,
                          error,
                        );
                      },
                    );
                  }
                } else {
                  console.log('No hay nuevas columnas para agregar.');
                }

                resolve();
              },
              error => {
                console.log(
                  `Error al obtener información de las columnas de la tabla "${tableName}":`,
                  error,
                );
                reject(error);
              },
            );
          } else {
            console.log(`La tabla "${tableName}" no existe.`);
            reject(`La tabla "${tableName}" no existe.`);
          }
        },
        error => {
          console.log(
            `Error al verificar la existencia de la tabla "${tableName}":`,
            error,
          );
          reject(error);
        },
      );
    });
  });
};
