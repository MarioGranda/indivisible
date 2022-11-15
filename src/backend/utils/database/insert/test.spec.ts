import { insertMany, insertOne } from "./index";
import { format } from "mysql2/promise";

let connection;

const pool = {
  getConnection: () => Promise.resolve(connection),
};

jest.mock("../../../services/database", () => ({
  getPool: () => Promise.resolve(pool),
}));

describe("backend/utils/insert", () => {
  beforeEach(() => {
    connection = {
      query: jest.fn(),
      release: jest.fn(),
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
    };
  });

  describe("insertOne", () => {
    it("shoud generate and execute an SQL query to insert a single row in the given table", async () => {
      connection.query.mockImplementation((query, params) => {
        return format(query, params);
      });

      const resultingQuery = await insertOne(connection, "user", {
        age: 20,
        name: "John Doe",
        is_active: false,
      });

      expect(connection.query).toHaveBeenCalledTimes(1);
      expect(resultingQuery).toBe(
        "INSERT INTO `user` (`age`, `name`, `is_active`) VALUES (20, 'John Doe', false)"
      );
    });
  });

  describe("insertMany", () => {
    it("shoud generate and execute an SQL query to insert a multiple rows in the given table", async () => {
      connection.query.mockImplementation((query, params) => {
        return format(query, params);
      });

      const resultingQuery = await insertMany(connection, "user", [
        {
          age: 20,
          name: "John Doe",
          is_active: false,
        },
        {
          age: 25,
          name: "Lorem ipsum",
          is_active: true,
        },
      ]);

      expect(connection.query).toHaveBeenCalledTimes(1);
      expect(resultingQuery).toBe(
        "INSERT INTO `user` (`age`, `name`, `is_active`) VALUES (20, 'John Doe', false), (25, 'Lorem ipsum', true)"
      );
    });
  });
});
