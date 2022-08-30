import FixedContainer from "@/client/layouts/FixedContainer";
import Image from "next/image";
import React, { FC, useRef } from "react"
import Footer from "@/client/components/Footer";
import { LocomotiveScrollProvider } from 'react-locomotive-scroll'


const Home: FC<[]> = () => {
  const borderIn = useRef<HTMLDivElement>(null);
  const borderOut = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef(null)

  let isDown = false;

  const handleZoom = (scroll) => {
    console.log(isDown)
    scroll.on('scroll', (args) => {
      scrollY = args.scroll.y
      if (scrollY <= 100 && isDown) {
        isDown = false
        text.current.classList.remove("animate-disappear")
        text.current.classList.add("animate-appear")
      } else if (scrollY > 100 && !isDown) {
        isDown = true
        text.current.classList.remove("animate-appear")
        text.current.classList.add("animate-disappear")
      }
    })

  }


  return (
    <LocomotiveScrollProvider
      options={
        {
          smooth: true,
          // ... all available Locomotive Scroll instance options 
        }
      }
      watch={
        []
      }
      onUpdate={scroll => handleZoom(scroll)}
      containerRef={containerRef}
    >
      <div data-scroll-container ref={containerRef}>
        <div ref={text} data-scroll-section id="deploying-democracy" className="text-white font-source">
          <FixedContainer className="flex justify-center h-[1100px]">
            <span data-scroll data-scroll-delay="0.035" data-scroll-speed="-2" className="pt-[400px] hover:scale-110 deploying-democracy-bg bg-[center_top_200px]">
              <p className="text-6xl">INDIVISBLE DAO</p>
              <p className="text-xl">Deploying democracy</p>
            </span>
          </FixedContainer>
        </div>
        <div data-scroll-section className="">
          <FixedContainer className="flex flex-col gap-52">
            <p className="w-[624px] text-white font-source text-5xl">Lorem Ipsum</p>
            <p className="w-[624px] place-self-end text-white font-source text-xl">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis soluta, dolores expedita possimus magni molestias cumque repellat rem suscipit commodi totam, eius provident maiores blanditiis, explicabo illo quo delectus! Libero.</p>
          </FixedContainer>
        </div>
        <div data-scroll-section className="flex flex-col items-center h-[700px] justify-center">
          <Image
            data-scroll data-scroll-delay="0.035" data-scroll-speed="-1"
            src={"/static/images/home.gif"}
            width="500"
            height="500"
            className="opacity-50"
          />
        </div>
        <div data-scroll-section className="">
          <FixedContainer className="flex flex-col gap-52">
            <div className="w-[624px] text-white font-source">
              <h2 className="text-5xl py-4">
                Lorem Ipsum
              </h2>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat eius omnis magnam? Ipsam inventore delectus autem optio mollitia hic illo a! Dignissimos saepe animi nihil quidem asperiores reprehenderit illum porro.
            </div>
            <div className="w-[624px] text-white font-source place-self-end relative">
              <div data-scroll data-scroll-direction="vertical" data-scroll-speed="1" ref={borderIn} className="absolute left-0 top-0 w-[700px] h-[280px] border border-white">
              </div>
              <div ref={borderOut} data-scroll data-scroll-direction="horizontal" data-scroll-speed="-1" className="absolute left-0 top-0 w-[700px] h-[280px] border border-white">
              </div>
              <div className="py-8 px-16">
                <h2 className="text-5xl py-4">
                  Lorem Ipsum
                </h2>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat eius omnis magnam? Ipsam inventore delectus autem optio mollitia hic illo a! Dignissimos saepe animi nihil quidem asperiores reprehenderit illum porro.
              </div>
            </div>
          </FixedContainer>
        </div>
        <div data-scroll-section id="about">
          <FixedContainer className="flex flex-col gap-52 h-screen text-white font-source mb-96">
            <p data-scroll data-scroll-sticky data-scroll-target="#about" className="pt-32 w-[624px] text-5xl">Lorem Ipsum</p>
            <div className="w-[624px] place-self-end">
              <h3 className="text-3xl pt-10 pb-5">
                First point
              </h3>
              <p className="text-xl">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis soluta, dolores expedita possimus magni molestias cumque repellat rem suscipit commodi totam, eius provident maiores blanditiis, explicabo illo quo delectus! Libero.</p>
              <h3 className="text-3xl my-5">
                Second point
              </h3>
              <p className="text-xl">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis soluta, dolores expedita possimus magni molestias cumque repellat rem suscipit commodi totam, eius provident maiores blanditiis, explicabo illo quo delectus! Libero.</p>
              <h3 className="text-3xl pt-10 pb-5">
                Third point
              </h3>
              <p className="text-xl">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis soluta, dolores expedita possimus magni molestias cumque repellat rem suscipit commodi totam, eius provident maiores blanditiis, explicabo illo quo delectus! Libero.</p>
              <h3 className="text-3xl my-5"></h3>
            </div>
          </FixedContainer>
        </div>
        <div data-scroll-section>
          <FixedContainer className="mt-[1100px] flex flex-col gap-52 h-screen">
            <p className="w-[624px] text-white font-source text-5xl">Lorem Ipsum</p>
            <p className="w-[624px] place-self-end text-white font-source text-xl">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis soluta, dolores expedita possimus magni molestias cumque repellat rem suscipit commodi totam, eius provident maiores blanditiis, explicabo illo quo delectus! Libero.</p>
          </FixedContainer>
        </div>
        <div data-scroll-section className="">
          <Footer />
        </div>
      </div>
    </LocomotiveScrollProvider>
  );
};

export default Home
