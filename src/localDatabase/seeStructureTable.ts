import {SQLiteDatabase, ResultSet} from 'react-native-sqlite-storage';

export const seeStructureTable = async (
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
              console.log(`Column Name: ${column.name}, Type: ${column.type}`);
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
