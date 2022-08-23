import { FC, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import Link from "next/link";
import { getPolygonscanUrl } from "@/shared/utils/createUrls";
import { useDispatch } from "react-redux";
import { closeNotification } from "../redux/actions/notification";
import { useNotification } from "../redux/selectors";
import { Router } from "next/router";
import FixedContainer from "../layouts/FixedContainer";
import { CgSpinner } from "react-icons/cg";
import { BiErrorAlt } from "react-icons/bi";

const Notification: FC = () => {
  const dispatch = useDispatch();
  const notification = useNotification();


  // Close notification on routeChangeComplete
  useEffect(() => {
    const onRouteChangeComplete = () => {
      dispatch(closeNotification());
    };
    if (notification && notification.closeOnRouteChange !== false) {
      Router.events.on("routeChangeComplete", onRouteChangeComplete);
      return () =>
        Router.events.off("routeChangeComplete", onRouteChangeComplete);
    }
  }, [dispatch, notification]);

  const handleOnBtnClick = async (e: MouseEvent) => {
    if (!notification) {
      return;
    }

    if (notification.onClick) {
      await notification.onClick(e);
    }

    if (notification.closeOnBtnClick) {
      await dispatch(closeNotification());
    }
  };

  if (!notification) {
    return null;
  }

  return (
    <div className="flex min-w-screen h-full fixed items-center inset-0 z-10">
    <FixedContainer className="font-source text-white border border-white bg-black w-[353px]">
        {
          notification.bgImage && (
            <div>
              <Image
                src={notification.bgImage}
                alt="notification background image"
                aria-label="notification background image"
                layout="fill"
                className="rounded-lg"
              />
            </div>
          )
        }
        < div
        className={`flex flex-col rounded-sm flex-1 p-5 backdrop-blur-3xl w-full ${notification.bgImage && "backdrop-contrast-50"
        }`}
      >
      <div className="self-end">
        <MdClose
          className="cursor-pointer"
          size={25}
          onClick={() => dispatch(closeNotification())}
        />
      </div>
      <div className="flex flex-col flex-1 justify-center gap-5">
        <div className="flex flex-col gap-7 items-center justify-center">
          {notification.image && notification.status !==  "FAILED" ? (
            <div>
              <Image
                src={notification.image}
                alt="notification image"
                height="100"
                width="100"
                className="object-contain"
              />
            </div>
          ) : (<BiErrorAlt className="h-24 w-24 m-2"></BiErrorAlt>)}
          <h2 className="text-lg font-source leading-tight text-center font-semibold">
            {notification.title}
          </h2>
        </div>
        <div className="flex flex-col border-1 border-t border-gray-350 items-center w-full gap-5 pt-12 mb-6">
          {notification.status !== "FAILED" && (
              <CgSpinner className="animate-spin h-10 w-10 m-2"></CgSpinner>
          )}
          <p className="text-xs font-source break-words leading-normal text-center max-w-[199px] font-medium whitespace-pre-wrap">
            {notification.description}
          </p>
          {notification.transactionHash && notification.status === "SUCCESS" && (
            <div>
              <Link
                passHref
                href={getPolygonscanUrl(notification.transactionHash)}
              >
                <a target="_blank">
                  Tx hash:{" "}
                  {notification.transactionHash.substring(0, 6) + "..."}
                </a>
              </Link>
            </div>
          )}
          {notification.btnText && (
            <button
              className="text-white rounded-sm border py-2 px-12"
              onClick={handleOnBtnClick}
            >
              {notification.btnText}
            </button>
          )}
        </div>
      </div>
    </div>
    </FixedContainer >
    </div>
  );
};

export default Notification;
