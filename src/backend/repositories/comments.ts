import { TABLE_NAMES } from "@/shared/constants/tableNames";
import { Comment, Proposal } from "@/shared/models";
import { getPool } from "../services/database";
import { RowDataPacket } from "mysql2/promise";
import { commentMapper } from "../mappers/comment";

export const findCommentsByProposalId = async (proposalId: number
): Promise<Comment[]> => {
    const query = `select c.* 
        from ${TABLE_NAMES.COMMENT} c
        where c.proposal_id = ?
      `;
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
        query, proposalId
    );

    return rows.map(commentMapper);
};

