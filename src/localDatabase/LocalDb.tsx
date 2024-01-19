import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SQLite, {SQLiteDatabase, ResultSet} from 'react-native-sqlite-storage';
import {styles} from '../../styles/styles';
import {data} from './data';
import {IData} from '../entities/data';

export const LocalDb = () => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    openDb();
  }, []);

  const openDb = async () => {
    try {
      if (db) {
        console.log('La base de datos ya está abierta');
        return db;
      }

      const dataBase: SQLiteDatabase = await SQLite.openDatabase({
        name: 'db2',
      });
      console.log('Base de datos abierta');
      setDb(() => dataBase);
      return dataBase;
    } catch (error) {
      console.log('Error al abrir la base de datos: ', error);
      throw error;
    }
  };

  const executeSql = async (
    query: string,
    args: any[] = [],
    successCallback: (result: ResultSet) => void,
    errorCallback: (error: any) => void,
  ) => {
    try {
      await db?.transaction(tx => {
        tx.executeSql(
          query,
          args,
          (_, result) => successCallback(result),
          (_, error) => errorCallback(error),
        );
      });
    } catch (error) {
      console.log('Error en la transacción SQL: ', error);
    }
  };

  const createTable = async () => {
    try {
      if (!db) {
        console.log('La base de datos no está abierta');
        return;
      }

      const tableCheckResult = await new Promise<boolean>(resolve => {
        executeSql(
          'SELECT name FROM sqlite_master WHERE type="table" AND name="usuarios"',
          [],
          result => resolve(result.rows.length > 0),
          error => {
            console.log(
              'Error al verificar la existencia de la tabla: ',
              error,
            );
            resolve(false);
          },
        );
      });

      const datosArray: IData[] = await data();

      if (!tableCheckResult) {
        // La tabla no existe, entonces la creamos
        executeSql(
          'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, gay BOOLEAN)',
          [],
          async _ => {
            for (const dato of datosArray) {
              await updateTableSchema('usuarios', dato);
            }
            console.log('Tabla de usuarios creada con éxito');
          },
          error => console.log('Error al crear la tabla de usuarios: ', error),
        );

        console.log('Tabla creada con éxito');
      } else {
        for (const dato of datosArray) {
          await updateTableSchema('usuarios', dato);
        }
        console.log('La tabla de usuarios ya existe');
      }
      return new Promise<void>(resolve => {
        executeSql(
          'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, gay BOOLEAN)',
          [],
          async _ => {
            for (const dato of datosArray) {
              await updateTableSchema('usuarios', dato);
            }
            console.log('Tabla de usuarios creada con éxito');
            resolve(); // Resolver la promesa aquí
          },
          error => {
            console.log('Error al crear la tabla de usuarios: ', error);
            resolve(); // Resolver la promesa incluso si hay un error
          },
        );
      });
    } catch (error) {
      console.log('Error al crear la tabla de usuarios: ', error);
    }
  };

  const insertData = async () => {
    try {
      if (!db) {
        console.log('La base de datos no está abierta');
        return;
      }

      const datosArray: IData[] = await data();
      console.log('datos :>> ', datosArray);

      for (const datos of datosArray) {
        const userExists = await new Promise<boolean>(resolve => {
          executeSql(
            'SELECT * FROM usuarios WHERE name = ? AND age = ?',
            [datos.name, datos.age],
            result => resolve(result.rows.length > 0),
            error => {
              console.log('Error al verificar existencia del usuario: ', error);
              resolve(false);
            },
          );
        });

        if (userExists) {
          console.log('El usuario ya existe, no se realizará la inserción');
          return;
        }

        const columnNames = Object.keys(datos).join(', ');
        const values = Object.values(datos);
        const placeholders = Array(values.length).fill('?').join(', ');

        const query = `INSERT INTO usuarios (${columnNames}) VALUES (${placeholders})`;

        executeSql(
          query,
          values,
          async _ => {
            await updateTableSchema('usuarios', datos);
            console.log('Datos insertados con éxito1');
          },
          error => console.log('Error al insertar datos1: ', error),
        );
      }
      console.log('Datos insertados con éxito2');
    } catch (error) {
      console.log('Error al insertar datos2: ', error);
    }
  };
  const updateTableAndData = async () => {
    await createTable();
    await insertData();
  };

  const viewData = async () => {
    try {
      if (!db) {
        console.log('La base de datos no está abierta');
        return;
      }

      const result: ResultSet = await new Promise((resolve, reject) => {
        executeSql(
          'SELECT * FROM usuarios',
          [],
          result => resolve(result),
          error => reject(error),
        );
      });

      const rows = result.rows;
      console.log('rows :>> ', rows);
      for (let i = 0; i < rows.length; i++) {
        const item = rows.item(i);
        console.log('Datos de usuario:', item);
      }
    } catch (error) {
      console.log('Error al obtener datos: ', error);
    }
  };

  const updateTableSchema = async (tableName: string, model: any) => {
    try {
      const tableInfo = await new Promise<any[]>(resolve => {
        executeSql(
          `PRAGMA table_info(${tableName})`,
          [],
          result => {
            const rows = result.rows;
            const columns = [];
            for (let i = 0; i < rows.length; i++) {
              columns.push(rows.item(i));
            }
            resolve(columns);
          },
          error => {
            console.log('Error al obtener información de la tabla: ', error);
            resolve([]);
          },
        );
      });

      const existingColumns = tableInfo.map(column => column.name);
      const modelProperties = Object.keys(model);

      const missingColumns = modelProperties.filter(
        property => !existingColumns.includes(property),
      );

      const obsoleteColumns = existingColumns.filter(
        column => !modelProperties.includes(column),
      );

      if (missingColumns.length > 0 || obsoleteColumns.length > 0) {
        // Crear una copia temporal de la tabla
        const tempTableName = `${tableName}_temp`;
        const createTempTableQuery = `CREATE TABLE IF NOT EXISTS ${tempTableName} AS SELECT * FROM ${tableName};`;

        executeSql(
          createTempTableQuery,
          [],
          _ => console.log('Tabla temporal creada con éxito'),
          error => console.log('Error al crear la tabla temporal: ', error),
        );

        // Eliminar la tabla original
        const dropTableQuery = `DROP TABLE IF EXISTS ${tableName};`;

        executeSql(
          dropTableQuery,
          [],
          _ => console.log('Tabla original eliminada con éxito'),
          error => console.log('Error al eliminar la tabla original: ', error),
        );

        // Crear la nueva tabla con la estructura actualizada
        const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${modelProperties
          .map(property => `${property} TEXT`)
          .join(', ')});`;

        console.log(
          `Estructura de la nueva tabla (${tableName}): ${createTableQuery}`,
        );

        executeSql(
          createTableQuery,
          [],
          _ => console.log('Nueva tabla creada con éxito'),
          error => console.log('Error al crear la nueva tabla: ', error),
        );

        // Migrar datos desde la tabla temporal a la nueva tabla
        const migrateDataQuery = `INSERT INTO ${tableName} SELECT * FROM ${tempTableName};`;

        executeSql(
          migrateDataQuery,
          [],
          _ => console.log('Datos migrados con éxito'),
          error => console.log('Error al migrar datos: ', error),
        );

        // Eliminar la tabla temporal
        const dropTempTableQuery = `DROP TABLE IF EXISTS ${tempTableName};`;

        executeSql(
          dropTempTableQuery,
          [],
          _ => console.log('Tabla temporal eliminada con éxito'),
          error => console.log('Error al eliminar la tabla temporal: ', error),
        );
      }

      console.log('La tabla está actualizada');
    } catch (error) {
      console.log('Error al actualizar la tabla: ', error);
    }
  };

  const tableExists = async (tableName: string) => {
    const result = await new Promise<boolean>(resolve => {
      executeSql(
        `SELECT name FROM sqlite_master WHERE type="table" AND name=?`,
        [tableName],
        result => resolve(result.rows.length > 0),
        error => {
          console.log('Error al verificar la existencia de la tabla: ', error);
          resolve(false);
        },
      );
    });
    return result;
  };

  const dataExists = async () => {
    const result = await new Promise<boolean>(resolve => {
      executeSql(
        'SELECT * FROM usuarios',
        [],
        result => resolve(result.rows.length > 0),
        error => {
          console.log('Error al verificar la existencia de datos: ', error);
          resolve(false);
        },
      );
    });
    return result;
  };

  const enableUpdateButton = async () => {
    return !db || (db && !(await tableExists('usuarios')));
  };

  const enableViewButton = async () => {
    return db && (await tableExists('usuarios')) && (await dataExists());
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.scanButton}
        onPress={openDb}>
        <Text style={styles.scanButtonText}>Crear base de datos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.5}
        style={[
          styles.scanButton,
          {backgroundColor: db ? '#2196F3' : '#CCCCCC'},
        ]}
        onPress={updateTableAndData}
        disabled={!enableUpdateButton}>
        <Text style={styles.scanButtonText}>Actualizar tabla y datos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.scanButton, {backgroundColor: db ? 'red' : '#CCCCCC'}]}
        onPress={viewData}
        disabled={!enableViewButton}>
        <Text style={styles.scanButtonText}>Consultar datos</Text>
      </TouchableOpacity>
    </View>
  );
};
