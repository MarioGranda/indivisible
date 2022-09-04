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
    const _class = classNames("w-[250px] h-screen text-white", className);
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
            <Link passHref href={getDaoUrl(dao.slug)}>
            <a>
                <article className="bg-black cursor-pointer rounded-xl h-[320px] p-4">
                    <div className="flex justify-center h-[200px] border border-white rounded-xl">
                        <Image
                            src={dao.image}
                            alt={`${dao.name} image`}
                            width={200}
                            height={200}
                            //blurDataURL={DEFAULT_IMAGE_PLACEHOLDER}
                            //placeholder="blur"
                            className="rounded object-cover "
                        />
                    </div>

                    <div className="flex flex-col py-4 justify-between items-start">
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
                            className="rounded-xl flex items-center h-10 font-bold my-2 bg-black border border-white disabled:opacity-50 enabled:hover:border-green enabled:focus:border-green p-4 shadow-lg"
                        >
                            Join +
                        </button>
                        </div>
                    </div>
                </article>
            </a>
            </Link>
        </section>
    );
};

export default DaoCard;
