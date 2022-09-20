import { TABLE_NAMES } from "@/shared/constants/tableNames";
import { Comment } from "@/shared/models";
import { getPool } from "../services/database";
import { RowDataPacket } from "mysql2/promise";
import { commentMapper } from "../mappers/comment";
import { CreateDiscussionInput } from "@/shared/validators/createDiscussion";
import { insertOne } from "../utils/database";

export const findCommentsByProposalId = async (
  proposalId: number
): Promise<Comment[]> => {
  const query = `select c.* 
        from ${TABLE_NAMES.COMMENT} c
        where c.proposal_id = ?
      `;
  const pool = await getPool();
  const connection = await pool.getConnection();

  const [rows] = await connection.query<RowDataPacket[]>(query, proposalId);

  return rows.map(commentMapper);
};

export const insertComment = async (input: CreateDiscussionInput) => {
  const pool = await getPool();
  const connection = await pool.getConnection();

  const [data] = await connection.query<
    RowDataPacket[]
  >(`select COUNT(*) as discussions_count
  from ${TABLE_NAMES.COMMENT} 
`);

  const [rows] = await insertOne(connection, TABLE_NAMES.COMMENT, {
    proposal_id: input.proposalId,
    text: input.text,
    head_comment: input.headComment ?? data[0].discussions_count + 1,
    user_id: input.userId,
    user_address: input.userAddress,
    title: input.title,
  });

  return rows.insertId;
};
