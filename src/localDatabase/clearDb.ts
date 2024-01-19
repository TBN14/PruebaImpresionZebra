import {SQLiteDatabase} from 'react-native-sqlite-storage';

export const clearDb = async (db: SQLiteDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Obtener la lista de tablas en la base de datos
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table';",
          [],
          (_, result) => {
            for (let i = 0; i < result.rows.length; i++) {
              const tableName = result.rows.item(i).name;
              const query = `DROP TABLE IF EXISTS ${tableName};`;

              tx.executeSql(
                query,
                [],
                (_, deleteResult) =>
                  console.log(console.log(`Tabla "${tableName}" eliminada`)),
                error =>
                  console.log(
                    `Error al eliminar la tabla "${tableName}":`,
                    error,
                  ),
              );
            }
          },
          error => console.log('Error al obtener la lista de tablas:', error),
        );
      },
      error => {
        console.log('Error al iniciar la transacción de limpieza:', error);
        reject(error);
      },
      () => {
        console.log('Limpieza de la base de datos completada');
        resolve();
      },
    );
  });
};
