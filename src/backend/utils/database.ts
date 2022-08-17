import { Connection, ResultSetHeader } from "mysql2/promise";

export const insertMany = (
    connection: Connection,
    tableName: string,
    values: Record<string, unknown>[]
  ) => {
    return connection.query<ResultSetHeader>("INSERT INTO ?? (??) VALUES ?", [
      tableName,
      Object.keys(values[0]),
      values.map(Object.values),
    ]);
  };
  
  /**
   * Usage: insertOne(connection, 'user', { firstname: 'John', lastname: 'Doe' })
   */
  export const insertOne = (
    connection: Connection,
    tableName: string,
    values: Record<string, unknown>
  ) => {
    return insertMany(connection, tableName, [values]);
  };
  