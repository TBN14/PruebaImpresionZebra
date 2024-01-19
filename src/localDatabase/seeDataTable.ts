import SQLite, {SQLiteDatabase, ResultSet} from 'react-native-sqlite-storage';

export const seeDataTable = async (db: SQLiteDatabase, tableName: string) => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${tableName};`,
        [],
        (_, results) => {
          const data: any[] = [];

          for (let i = 0; i < results.rows.length; i++) {
            console.log('🍆 REVISECAREPIPI😡 results:', results.rows.item(i));
            data.push(results.rows.item(i));
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
};
