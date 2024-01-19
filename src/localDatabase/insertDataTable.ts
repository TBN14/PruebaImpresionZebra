import {SQLiteDatabase, ResultSet} from 'react-native-sqlite-storage';
import {createTable, seeDataTable, seeStructureTable} from '.';

interface RowData {
  [key: string]: any;
}

export const insertDataTable = async (
  db: SQLiteDatabase,
  tableName: string,
  rowData: RowData,
): Promise<void> => {
  // await createTable(db, 'usuario', rowData);
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        const columns = Object.keys(rowData);
        const values = Object.values(rowData);

        // Verificar si ya existe una fila con los mismos datos
        const checkQuery = `SELECT * FROM ${tableName} WHERE ${columns
          .map(col => `${col} = ?`)
          .join(' AND ')};`;
        tx.executeSql(
          checkQuery,
          values,
          async (_, checkResult: ResultSet) => {
            if (checkResult.rows.length > 0) {
              // Ya existe una fila con los mismos datos, no hacer la inserción
              console.log(
                `Los datos ya existen en la tabla "${tableName}". No se realizará la inserción.`,
              );
              await seeDataTable(db, tableName);
              resolve();
            } else {
              // No existe una fila con los mismos datos, realizar la inserción
              const placeholders = columns.map(() => '?').join(', ');
              console.log('🍆 REVISECAREPIPI😡 placeholders:', placeholders);
              const insertQuery = `INSERT INTO ${tableName} (${columns.join(
                ', ',
              )}) VALUES (${placeholders});`;
              console.log('🍆 REVISECAREPIPI😡 insertQuery:', insertQuery);

              tx.executeSql(
                insertQuery,
                values,
                async (_, result: ResultSet) => {
                  console.log('resultInsertData :>> ', result);
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
