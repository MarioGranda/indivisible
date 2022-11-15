import React, { FC } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import BaseLayout from "@/client/layouts/BaseLayout";
import { Provider } from "react-redux";
import store from "@/client/redux/store";

import "@/client/styles/globals.scss";
import NextScripts from "@/client/components/next/NextScripts";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <NextScripts />
      <Provider store={store}>
        <BaseLayout>
          <TopProgressBar />
          <Component {...pageProps} />
        </BaseLayout>
      </Provider>
    </>
  );
};

const TopProgressBar = dynamic(
  () => {
    return import("@/client/components/shared/TopProgressBar");
  },
  { ssr: false }
);

export default MyApp;
