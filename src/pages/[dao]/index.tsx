import { FC } from "react";
import { Dao } from "@/shared/models";
import { findDaoBySlug } from "@/backend/repositories/dao";

interface Props {
    dao: Dao
}

const DaoPage: FC<Props> = ({
    dao
}) => {
    return (
        <>
            <span className="border border-white text-white">
                {dao.name}
            </span>
        </>
    );
};

export const getServerSideProps = async ({params}) => {
    const slug = params?.dao as string;
    const dao = await findDaoBySlug(slug);

    if (!dao) {
        return { notFound: true };
    }

    return {
        props: {
            dao
        },
    };
}

export default DaoPage;
