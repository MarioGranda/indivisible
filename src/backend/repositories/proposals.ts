import { TABLE_NAMES } from "@/shared/constants/tableNames";
import { Proposal } from "@/shared/models";
import { getPool } from "../services/database";
import { RowDataPacket } from "mysql2/promise";
import { proposalMapper } from "../mappers/proposal";

export const findProposalsByDaoId = async (
  daoId: number
): Promise<Proposal[]> => {
  const query = `select p.* 
        from ${TABLE_NAMES.PROPOSAL} p
        where p.dao_id = ?
      `;
  const pool = await getPool();
  const connection = await pool.getConnection();

  const [rows] = await connection.query<RowDataPacket[]>(query, daoId);

  return rows.map(proposalMapper);
};

export const findProposal = async (id: number): Promise<Proposal> => {
  const query = `select p.* 
            from ${TABLE_NAMES.PROPOSAL} p
            where p.id = ?
          `;
  const pool = await getPool();
  const connection = await pool.getConnection();

  const [rows] = await connection.query<RowDataPacket[]>(query, id);

  return rows.length > 0 ? proposalMapper(rows[0]) : null;
};
