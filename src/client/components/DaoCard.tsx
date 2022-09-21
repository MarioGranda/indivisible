import Image from "next/image";
import Link from "next/link";
import React, { FC, MouseEvent } from "react";
import { Dao } from "@/shared/models";
import { getDaoUrl } from "@/shared/utils/createUrls";
import { joinDao } from "../utils/joinDao";
import getProvider from "@/shared/utils/getProvider";
import axios from "axios";
import classNames from "classnames";
import {
  openPendingTransactionNotification,
  openTransactionCompleteNotification,
  openTransactionFailedNotification,
} from "../redux/actions/notification";
import { useDispatch } from "react-redux";
//import { DEFAULT_IMAGE_PLACEHOLDER } from "@/shared/constants/path";

interface Props {
  dao: Dao;
  className?: string;
  itemId: number;
}

const DaoCard: FC<Props> = ({ dao, className }) => {
  const _class = classNames("w-[250px] text-white", className);
  const dispatch = useDispatch();

  const join = async (e: MouseEvent) => {
    try {
      e.preventDefault();
      await dispatch(openPendingTransactionNotification(dao.image));
      const { signerAddress, result } = await joinDao(
        dao.address,
        getProvider()
      );
      if (!signerAddress) {
        return;
      }
      console.log(result);
      await axios.post("/api/join-dao", { signerAddress, daoId: dao.id });
      await dispatch(openTransactionCompleteNotification(result, dao.image));
    } catch (e) {
      console.log(e);
      await dispatch(openTransactionFailedNotification(e));
    }
  };

  return (
    <section className={_class}>
      <Link passHref href={getDaoUrl(dao.slug)}>
        <a>
          <article className="bg-black cursor-pointer rounded-xl h-[320px] p-4">
            <div className="relative flex justify-center h-[200px] rounded-xl">
              <Image
                src={dao.image}
                alt={`${dao.name} image`}
                layout="fill"
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
              <div className="flex justify-between">
                <button
                  onClick={(e) => join(e)}
                  className="rounded-xl flex items-center h-10 font-bold my-2 bg-black border border-white disabled:opacity-50 enabled:hover:border-green p-4 shadow-lg"
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
