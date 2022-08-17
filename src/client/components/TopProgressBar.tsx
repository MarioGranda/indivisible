import { useEffect } from "react";
import Router from "next/router";
import nProgress from "nprogress";

const delay = 475;

export default function TopProgressBar() {
  useEffect(() => {
    let isLoading = false;
    let timer: NodeJS.Timeout;

    function load() {
      if (isLoading) {
        return;
      }

      isLoading = true;

      nProgress.start();
    }

    function stop() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        nProgress.done();
        isLoading = false;
      }, delay);
    }

    Router.events.on("routeChangeStart", load);
    Router.events.on("routeChangeComplete", stop);
    Router.events.on("routeChangeError", stop);

    return () => {
      Router.events.off("routeChangeStart", load);
      Router.events.off("routeChangeComplete", stop);
      Router.events.off("routeChangeError", stop);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
