import SQLite, {ResultSet, SQLiteDatabase} from 'react-native-sqlite-storage';

import {IUsuario} from '../entities';
import {clearDb} from '.';

interface RowData {
  [key: string]: any;
}

export const allFunctions = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const db: SQLiteDatabase = await SQLite.openDatabase({
      name: 'PruebaDb14',
    });

    const executeSql = (
      db: SQLiteDatabase,
      query: string,
    ): Promise<ResultSet> => {
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            query,
            [],
            (_, result) => resolve(result),
            error => reject(error),
          );
        });
      });
    };

    const getTableColumns = async (
      db: SQLiteDatabase,
      tableName: string,
    ): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          const query = `PRAGMA table_info(${tableName});`;

          tx.executeSql(
            query,
            [],
            (_, result) => {
              const existingColumns: string[] = [];
              for (let i = 0; i < result.rows.length; i++) {
                const column = result.rows.item(i);
                existingColumns.push(column.name);
              }
              resolve(existingColumns);
            },
            error => {
              console.log(
                `Error al obtener la estructura de la tabla "${tableName}":`,
                error,
              );
              reject(error);
            },
          );
        });
      });
    };

    const columnsChanged = (
      existingColumns: string[],
      newColumns: string[],
    ): boolean => {
      // Comparamos las columnas existentes con las nuevas
      return JSON.stringify(existingColumns) !== JSON.stringify(newColumns);
    };

    const createTable = async (
      db: SQLiteDatabase,
      tableName: string,
      columns: any,
    ): Promise<void> => {
      try {
        const columnNames = Object.keys(columns[0]);
        const columnsDefinition = columnNames
          .map(prop => `${prop} TEXT`)
          .join(', ');

        // Verificar si la tabla ya existe
        const tableExistsQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`;

        const result = await executeSql(db, tableExistsQuery);

        if (result.rows.length > 0) {
          // La tabla ya existe, obtener las columnas existentes
          const existingColumns = await getTableColumns(db, tableName);

          // Verificar si las columnas han cambiado
          if (columnsChanged(existingColumns, columnNames)) {
            console.log(
              `La estructura de la tabla "${tableName}" ha cambiado. Se procederá a actualizar.`,
            );
            await updateStructureTable(db, tableName, columnNames);
          } else {
            console.log(
              `La estructura de la tabla "${tableName}" no ha cambiado. No se realizarán actualizaciones.`,
            );
          }
        } else {
          // La tabla no existe, crearla
          await executeSql(
            db,
            `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDefinition});`,
          );
          console.log(`Tabla "${tableName}" creada con éxito`);
        }

        // Insertar datos
        for (const usuario of columns) {
          await insertDataTable(db, tableName, usuario);
        }
      } catch (error) {
        console.error(
          `Error durante la creación de la tabla "${tableName}":`,
          error,
        );
        throw error;
      }
    };

    const updateStructureTable = async (
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
                        newColumnAdd = `${newColumnAdd} TEXT`;

                        if (!existingColumns.includes(newColumnAdd)) {
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
                              ]);
                            },
                            error => {
                              console.log(
                                `Error al agregar la nueva columna "${newColumnAdd}" a la tabla "${tableName}":`,
                                error,
                              );
                            },
                          );
                        } else {
                          console.log(
                            `La columna "${newColumnAdd}" ya existe en la tabla "${tableName}". No se realizará la adición.`,
                          );
                        }
                      }
                    } else {
                      console.log(
                        'No hay nuevas columnas para agregar. Por lo tanto no se actualizara la estructura de la tabla',
                      );
                      // await Promise.all([seeStructureTable(db, tableName)]);
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

    const seeStructureTable = async (
      db: SQLiteDatabase,
      tableName: string,
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          const query = `PRAGMA table_info(${tableName});`;

          tx.executeSql(
            query,
            [],
            (_, result: ResultSet) => {
              if (result.rows.length > 0) {
                for (let i = 0; i < result.rows.length; i++) {
                  const column = result.rows.item(i);
                  console.log(
                    `Column Name: ${column.name}, Type: ${column.type}`,
                  );
                }
              } else {
                console.log(`La tabla ${tableName} no existe`);
              }

              resolve();
            },
            error => {
              console.log(
                `Error al obtener la estructura de la tabla "${tableName}":`,
                error,
              );
              reject(error);
            },
          );
        });
      });
    };

    const insertDataTable = async (
      db: SQLiteDatabase,
      tableName: string,
      rowData: RowData,
    ): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        console.log(`Entre InsertDataTable`);
        await seeStructureTable(db, tableName);
        console.log(`Entre222 InsertDataTable`);
        db.transaction(
          tx => {
            const columns = Object.keys(rowData);
            console.log('🍆 REVISECAREPIPI😡 columns:', columns);
            const values = Object.values(rowData);
            console.log('🍆 REVISECAREPIPI😡 values:', values);

            // Verificar si ya existe una fila con el mismo nombre
            const checkQuery = `SELECT * FROM ${tableName} WHERE name = ?;`;
            tx.executeSql(
              checkQuery,
              [rowData.name],
              async (_, checkResult: ResultSet) => {
                if (checkResult.rows.length > 0) {
                  // Ya existe una fila con el mismo nombre, actualizar los datos existentes
                  const updateQuery = `UPDATE ${tableName} SET ${columns
                    .map(col => `${col} = ?`)
                    .join(', ')} WHERE name = ?;`;

                  tx.executeSql(
                    updateQuery,
                    [...values, rowData.name],
                    async (_, updateResult: ResultSet) => {
                      console.log(
                        `Datos actualizados en la tabla "${tableName}" con éxito`,
                      );
                      await seeDataTable(db, tableName);
                      resolve();
                    },
                    error => {
                      console.log(
                        `Error al actualizar datos en la tabla "${tableName}":`,
                        error,
                      );
                    },
                  );
                } else {
                  // No existe una fila con el mismo nombre, realizar la inserción
                  const placeholders = columns.map(() => '?').join(', ');

                  const insertQuery = `INSERT INTO ${tableName} (${columns.join(
                    ', ',
                  )}) VALUES (${placeholders});`;

                  tx.executeSql(
                    insertQuery,
                    values,
                    async (_, result: ResultSet) => {
                      await seeDataTable(db, tableName);
                      console.log(
                        `Datos insertados en la tabla "${tableName}" con éxito`,
                      );
                      resolve();
                    },
                    error => {
                      console.log(
                        `Error al insertar datos en la tabla "${tableName}":`,
                        error,
                      );
                    },
                  );
                }
              },
              error => {
                console.log('Error al verificar datos existentes:', error);
              },
            );
          },
          error => {
            console.log('Error al iniciar la transacción:', error);
          },
        );
      });
    };

    // const insertDataTable = async (
    //   db: SQLiteDatabase,
    //   tableName: string,
    //   rowData: RowData,
    // ): Promise<void> => {
    //   return new Promise((resolve, reject) => {
    //     db.transaction(
    //       tx => {
    //         const columns = Object.keys(rowData);
    //         const values = Object.values(rowData);

    //         // Verificar si ya existe una fila con los mismos datos
    //         const checkQuery = `SELECT * FROM ${tableName} WHERE ${columns
    //           .map(col => `${col} = ?`)
    //           .join(' AND ')};`;
    //         tx.executeSql(
    //           checkQuery,
    //           values,
    //           async (_, checkResult: ResultSet) => {
    //             if (checkResult.rows.length > 0) {
    //               // Ya existe una fila con los mismos datos, no hacer la inserción
    //               console.log(
    //                 `Los datos ya existen en la tabla "${tableName}". No se realizará la inserción.`,
    //               );
    //               await seeDataTable(db, tableName);
    //               resolve();
    //             } else {
    //               // No existe una fila con los mismos datos, realizar la inserción
    //               const placeholders = columns.map(() => '?').join(', ');

    //               const insertQuery = `INSERT INTO ${tableName} (${columns.join(
    //                 ', ',
    //               )}) VALUES (${placeholders});`;

    //               tx.executeSql(
    //                 insertQuery,
    //                 values,
    //                 async (_, result: ResultSet) => {
    //                   await seeDataTable(db, tableName);
    //                   console.log(
    //                     `Datos insertados en la tabla "${tableName}" con éxito`,
    //                   );
    //                   resolve();
    //                 },
    //                 error => {
    //                   console.log(
    //                     `Error al insertar datos en la tabla "${tableName}":`,
    //                     error,
    //                   );
    //                 },
    //               );
    //             }
    //           },
    //           error => {
    //             console.log('Error al verificar datos existentes:', error);
    //           },
    //         );
    //       },
    //       error => {
    //         console.log('Error al iniciar la transacción:', error);
    //       },
    //     );
    //   });
    // };

    const seeDataTable = async (
      db: SQLiteDatabase,
      tableName: string,
    ): Promise<any[]> => {
      try {
        console.log(`Entre Mostrar data`);
        await seeStructureTable(db, tableName);
        console.log(`Entre222 Mostrar data`);
        const data = await new Promise<any[]>((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              `SELECT * FROM ${tableName};`,
              [],
              (_, results) => {
                const data: any[] = [];

                for (let i = 0; i < results.rows.length; i++) {
                  data.push(results.rows.item(i));
                  console.log(
                    '🍆 REVISECAREPIPI😡 results.rows.item(i):',
                    results.rows.item(i),
                  );
                }
                console.log(`los datos de la tabla ${tableName} :>> `, data);
                resolve(data);
              },
              error => {
                reject(error);
              },
            );
          });
        });

        console.log('🍆 REVISECAREPIPI😡 data:', data);
        return data;
      } catch (error) {
        console.error('Error al mostrar los datos de la tabla:', error);
        throw error;
      }
    };

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
          sexo: 'gay',
          raza: 'negro',
          // height: '1.73cm',
          // weight: '70kg',
          // id: '12345',
        },
      ];

      await createTable(db, 'usuario', usuarios);

      // Verificar estructura de las tablas
      for (const usuario of usuarios) {
        await insertDataTable(db, 'usuario', usuario);
      }

      resolve();
    } catch (error) {
      console.error('Error durante la transacción:', error);
    }
  });
};
// debugger;
