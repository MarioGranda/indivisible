import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { Dao } from "@/shared/models";
import { getDaoUrl } from "@/shared/utils/createUrls";
import { joinDao } from "../utils/joinDao";
import getProvider from "@/shared/utils/getProvider";
import axios from "axios";
import classNames from "classnames";
//import { DEFAULT_IMAGE_PLACEHOLDER } from "@/shared/constants/path";

interface Props {
    dao: Dao;
    className?: string;
    itemId: number;
}

const DaoCard: FC<Props> = ({
    dao,
    className,
}) => {
    const _class = classNames("w-[350px] h-[450px] text-white", className);
    const _typeClass =
        "bg-black rounded-lg text-xl font-source text-white min-w-max"

    const join = async() => {
        const { signerAddress } = await joinDao(dao.address ,getProvider())
        if (!signerAddress) {
            return;
        }
        await axios.post("/api/join-dao", {signerAddress});
    }

    return (
        <section className={_class}>
            <a>
                <article className="bg-black px-4 rounded-sm cursor-pointer border border-white">
                    <div className="flex flex-row justify-between items-center py-4">
                        <span className={_typeClass}>
                            DAO
                        </span>
                    </div>

                    <div className="relative flex flex-col items-center justify-center mb-4 h-[260px]">
                        <Image
                            src={dao.image}
                            alt={`${dao.name} image`}
                            layout="fill"
                            //blurDataURL={DEFAULT_IMAGE_PLACEHOLDER}
                            //placeholder="blur"
                            className="rounded-md object-cover"
                        />
                    </div>

                    <div className="flex flex-col my-2 pt-4 justify-between items-start">
                        <h3
                            title={dao.name}
                            className="text-lg font-source leading-normal text-white whitespace-nowrap truncate"
                        >
                            {dao.name}
                        </h3>
                        <div className="flex justify-between"
                        >
                            <button
                            onClick={join}
                            className="flex items-center h-10 font-bold my-2 bg-black border border-white disabled:opacity-50 enabled:hover:border-green enabled:focus:border-green p-4 shadow-lg"
                        >
                            Join +
                        </button>
                        <Link passHref href={getDaoUrl(dao.slug)}>
                        <button
                            className="flex items-center h-10 font-bold my-2 bg-black border border-white disabled:opacity-50 enabled:hover:border-green enabled:focus:border-green p-4 shadow-lg"
                        >
                            Visit
                        </button>
                        </Link>
                        </div>
                    </div>
                </article>
            </a>
        </section>
    );
};

export default DaoCard;
