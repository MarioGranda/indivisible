import { TABLE_NAMES } from "@/shared/constants/tableNames";
import { Dao } from "@/shared/models";
import { slugify } from "@/shared/utils/strings";
import { CreateDaoInput } from "@/shared/validators/createDao";
import { getPool } from "../services/database";
import { insertOne } from "../utils/database";
import { RowDataPacket } from "mysql2/promise";
import { daoMapper } from "../mappers/dao";


export const insertDao = async (
    input: CreateDaoInput
): Promise<number> => {
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [rows] = await insertOne(connection, TABLE_NAMES.DAO, {
        name: input.name,
        description: input.description,
        slug: slugify(
            input.name
        ),
        dao_creator_address: input.daoCreatorAddress,
        image: input.daoImage,
        address: input.daoAddress,
        token_name: input.tokenName,
        token_symbol: input.tokenSymbol,
        token_image: input.tokenImage,
        min_quorum: input.minQuorum,
        min_consensus_deadline: input.minConsensusPeriod,
        min_voting_deadline: input.minVotingPeriod,
        transaction_hash: input.transactionHash
    });

    return rows.insertId;
};

export const findAllDaos = async (
): Promise<Dao[]> => {
    const query = `select d.* 
    from ${TABLE_NAMES.DAO} d
    order by d.id desc
  `;
    const pool = await getPool();
    const connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
        query
    );

    return rows.map(daoMapper);
};

export const findDaoBySlug = async (slug: string
    ): Promise<Dao> => {
        const query = `select d.* 
        from ${TABLE_NAMES.DAO} d
        where d.slug = ?
      `;
        const pool = await getPool();
        const connection = await pool.getConnection();
    
        const [rows] = await connection.query<RowDataPacket[]>(
            query, slug
        );
    
        return rows.length > 0 ? daoMapper(rows[0]) : null;
    };
