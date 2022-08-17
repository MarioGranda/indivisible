import FixedContainer from "@/client/layouts/FixedContainer";
import React, { FC, useEffect, useRef, useState } from "react"

const Home: FC<[]> = () => {
  const first = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);

  // Callback for IntersectionObserver
  const callback = function (entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
//absolute w-full h-full transition-all duration-500 ease-in-out transform"
      // Is the element in the viewport?
      if (entry.isIntersecting) {
        //text.current.style.removeProperty("animation")
        text.current.style.setProperty("animation", "zoomOut 2s ease-in-out")
        console.log("zoomOut")
      } else {
        console.log("out")
        text.current.style.removeProperty("animation")
        //text.current.style.setProperty("animation", "zoomOut 2s ease-in-out reverse")
      }
      // if (!entry.isIntersecting && isDown)
      // text.current.style.setProperty("animation", "zoomIn 2s ease-in-out")
      // console.log("zoomIn")
      // if (entry.intersectionRatio > prevRatio) {
      //   entry.target.classList.replace("ratio", entry.intersectionRatio);
      // } else {
      //   entry.target.style.backgroundColor = decreasingColor.replace("ratio", entry.intersectionRatio);
      // }
      // prevRatio = entry.intersectionRatio;
      // }
    });
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  }
  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    observer.observe(first.current);
    return () => {
      observer.disconnect();
    };
}, [])

  return (
    <div>
      <FixedContainer className="flex justify-center items-center h-screen">
        <p ref={text} className="text-white font-source text-6xl hover:scale-110">Deploying democracy</p>
      </FixedContainer>
      <div ref={first}>
      <FixedContainer className="flex justify-center gap-5 items-center h-screen">
        <p className="text-white font-source text-6xl">Deploying democracy</p>
      </FixedContainer>
      </div>
    </div>
  );
};

export default Home
