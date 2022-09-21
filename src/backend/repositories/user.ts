import { TABLE_NAMES } from "@/shared/constants/tableNames";
import { getPool } from "../services/database";
import { insertOne } from "../utils/database";
import { JoinDaoInput } from "@/shared/validators/joinDao";
import { User } from "@/shared/models";
import { RowDataPacket } from "mysql2/promise";
import { userMapper } from "../mappers/user";

export const insertUser = async (input: JoinDaoInput): Promise<number> => {
  const pool = await getPool();
  const connection = await pool.getConnection();

  const [rows] = await insertOne(connection, TABLE_NAMES.USER, {
    address: input.signerAddress,
    dao_id: input.daoId,
  });

  return rows.insertId;
};

export const findUsersByDao = async (daoId: number): Promise<User[]> => {
  const query = `select u.*,
        (select count(*) from ${TABLE_NAMES.PROPOSAL} p where p.user_id = u.id) proposals_count
        from ${TABLE_NAMES.USER} u
        order by proposals_count desc
      `;
  const pool = await getPool();
  const connection = await pool.getConnection();

  const [rows] = await connection.query<RowDataPacket[]>(query, daoId);

  return rows.map(userMapper);
};
