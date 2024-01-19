import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {
  insertDataTable,
  seeDataTable,
  seeStructureTable,
  updateTableStructure,
} from '.';

export const createTable = async (
  db: SQLiteDatabase,
  tableName: string,
  columns: any,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const columnNames = Object.keys(columns[0]);
    // const columnNames = Object.keys(columns);

    const columnsDefinition = columnNames
      .map(prop => `${prop} TEXT`)
      .join(', ');

    // Verificar si la tabla ya existe
    const tableExistsQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`;

    db.transaction(async tx => {
      tx.executeSql(
        tableExistsQuery,
        [],
        async (_, result) => {
          if (result.rows.length > 0) {
            // La tabla ya existe, obtener las columnas existentes
            const existingColumns = await getTableColumns(db, tableName);

            // Verificar si las columnas han cambiado
            if (columnsChanged(existingColumns, columnNames)) {
              console.log(
                `La estructura de la tabla "${tableName}" ha cambiado. Se procederá a actualizar.`,
              );
              await updateTableStructure(
                db,
                tableName,
                columnNames,
                // existingColumns,
              );
              for (const usuario of columns) {
                await insertDataTable(db, tableName, usuario);
              }
              resolve();
            } else {
              console.log(
                `La estructura de la tabla "${tableName}" no ha cambiado. No se realizarán actualizaciones.`,
              );
              await Promise.all([
                seeStructureTable(db, 'usuario'),
                seeDataTable(db, 'usuario'),
              ]);

              for (const usuario of columns) {
                await insertDataTable(db, tableName, usuario);
              }

              resolve();
            }
          } else {
            // La tabla no existe, crearla
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDefinition});`,
              [],
              async () => {
                await Promise.all([
                  seeStructureTable(db, 'usuario'),
                  seeDataTable(db, 'usuario'),
                ]);
                console.log(`Tabla "${tableName}" creada con éxito`);
                for (const usuario of columns) {
                  await insertDataTable(db, tableName, usuario);
                }
                resolve();
              },
              error =>
                console.log(`Error al crear la tabla "${tableName}":`, error),
            );
          }
        },
        error =>
          console.log(
            `Error al verificar la existencia de la tabla "${tableName}":`,
            error,
          ),
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
