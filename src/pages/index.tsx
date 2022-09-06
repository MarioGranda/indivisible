import FixedContainer from "@/client/layouts/FixedContainer";
import Image from "next/image";
import React, { FC, useEffect, useRef } from "react";
import Footer from "@/client/components/Footer";
import {
  LocomotiveScrollProvider,
  useLocomotiveScroll,
} from "react-locomotive-scroll";
import { MdFamilyRestroom } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { FaHandshake } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import { BENEFITS } from "@/client/utils/benefits";
import { useRouter } from "next/router";

const Home: FC<[]> = () => {
  const borderIn = useRef<HTMLDivElement>(null);
  const borderOut = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef(null);
  const router = useRouter();

  let isDown = false;

  const handleZoom = (scroll) => {
    scroll.on("scroll", (args) => {
      const scrollY = args.scroll.y;
      if (scrollY <= 100 && isDown) {
        isDown = false;
        text.current.classList.remove("animate-disappear");
        text.current.classList.add("animate-appear");
      } else if (scrollY > 100 && !isDown) {
        isDown = true;
        text.current.classList.remove("animate-appear");
        text.current.classList.add("animate-disappear");
      }
    });
  };

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        direction: "vertical",
        multiplier: 0.5,
        lerp: 0.2,
        // ... all available Locomotive Scroll instance options
      }}
      watch={[]}
      onUpdate={(scroll) => handleZoom(scroll)}
      containerRef={containerRef}
    >
      <div data-scroll-container ref={containerRef}>
        <div
          ref={text}
          data-scroll-section
          id="deploying-democracy"
          className="text-white font-source"
        >
          <FixedContainer className="flex justify-center h-[1100px]">
            <span
              data-scroll
              data-scroll-delay="0.035"
              data-scroll-speed="-4"
              className="pt-[400px] hover:scale-110 deploying-democracy-bg bg-[center_top_200px]"
            >
              <p className="text-8xl">INDIVISIBLE</p>
              <p className="text-xl">Deploying democracy</p>
            </span>
          </FixedContainer>
        </div>
        <div data-scroll-section className="">
          <FixedContainer className="flex flex-col gap-52">
            <p className="w-[624px] text-white font-source text-5xl">
              No-code tools for building democratic communities.
            </p>
            <p className="w-[624px] place-self-end text-white font-source text-xl">
              To engage and empower everyday people in the decisions that impact
              them the most, to promote sustainable resource management,
              collective ownership, and community vitality.
            </p>
          </FixedContainer>
        </div>
        <div
          data-scroll-section
          className="flex flex-col items-center h-[700px] justify-center"
        >
          <Image
            data-scroll
            data-scroll-delay="0.035"
            data-scroll-speed="-1"
            src={"/static/images/home.gif"}
            width="500"
            height="500"
            className="opacity-50"
          />
        </div>
        <div data-scroll-section className="">
          <FixedContainer className="flex flex-col gap-52 h-[1500px]">
            <div className="w-[624px] text-white font-source">
              <h2 className="text-5xl py-4">Why?</h2>
              <h3 className="text-3xl py-4">
                Communities are happier & healthier, & neighbors are stronger
                when they’re united.
              </h3>
              Giving people a platform to build a shared vision for a common
              future and solutions to achieve small things and potentially
              overcome failures in today’s representative models that
              efficiently barter power and resources, and produce inefficiency,
              apathy, inequality and injustice.
            </div>
            <div className="w-[624px] text-white font-source place-self-end relative">
              <div
                data-scroll
                data-scroll-direction="vertical"
                data-scroll-speed="1"
                ref={borderIn}
                className="absolute left-0 top-0 w-[700px] h-[320px] border border-white"
              ></div>
              <div
                ref={borderOut}
                data-scroll
                data-scroll-direction="horizontal"
                data-scroll-speed="-1"
                className="absolute left-0 top-0 w-[700px] h-[320px] border border-white"
              ></div>
              <div className="py-10 px-16">
                <h2 className="text-5xl py-4">Who?</h2>
                Like a public space, Indivisible is for everyone, which is why
                we are producing the no-code tools and templatized solutions for
                building more democratic communities and entrepreneurial
                collectives to build the change we need for our society to
                thrive. If you’re impacted, you can participate.
              </div>
            </div>
          </FixedContainer>
        </div>
        <div id="about" data-scroll-section className="h-screen">
          <FixedContainer className="flex flex-col gap-52 text-white font-source">
            <p
              data-scroll
              data-scroll-sticky
              data-scroll-target="#about"
              data-scroll-repeat
              className="pt-28 w-[624px] text-4xl"
            >
              Potential use cases
            </p>
            <div className="w-[624px] place-self-end">
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                <MdFamilyRestroom size={40} />
                Family & friends
              </h3>
              <p className="text-xl">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis soluta, dolores expedita possimus magni molestias
                cumque repellat rem suscipit commodi totam, eius provident
                maiores blanditiis, explicabo illo quo delectus! Libero.
              </p>
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                <AiFillHome size={40} />
                Tenants/interest groups
              </h3>
              <p className="text-xl">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis soluta, dolores expedita possimus magni molestias
                cumque repellat rem suscipit commodi totam, eius provident
                maiores blanditiis, explicabo illo quo delectus! Libero.
              </p>
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                <FaHandshake size={40} />
                Coalitions
              </h3>
              <p className="text-xl">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis soluta, dolores expedita possimus magni molestias
                cumque repellat rem suscipit commodi totam, eius provident
                maiores blanditiis, explicabo illo quo delectus! Libero.
              </p>
              <h3 className="text-3xl my-5"></h3>
            </div>
          </FixedContainer>
        </div>
        <div
          id="build-a-community"
          data-scroll-section
          className="h-[1250px] mt-[1100px]"
        >
          <FixedContainer className="flex flex-col gap-52 text-white font-source">
            <p
              data-scroll
              data-scroll-sticky
              data-scroll-target="#build-a-community"
              data-scroll-repeat
              className="pt-28 w-[624px] text-4xl"
            >
              Build a healthy community
            </p>
            <div className="w-[624px] place-self-end">
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                Participatory economics
              </h3>
              <p className="text-xl">
                Equity, solidarity, diversity, workers&apos; self-management,
                efficiency (defined as accomplishing goals without wasting
                valued assets) and sustainability..
              </p>
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                Participatory politics
              </h3>
              <p className="text-xl">
                Freedom, self-management, justice, solidarity, and tolerance.
              </p>
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">Governance</h3>
              <p className="text-xl">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis soluta, dolores expedita possimus magni molestias
                cumque repellat rem suscipit commodi totam, eius provident
                maiores blanditiis, explicabo illo quo delectus! Libero.
              </p>
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                Blockchain technology
              </h3>
              <p className="text-xl">
                Censhorship-resistant, transparency, auditability and prevention
                manipulation.
              </p>
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                Rewarding participation
              </h3>
              <p className="text-xl">
                Get rewards by helping your community become a better place.
              </p>
            </div>
          </FixedContainer>
        </div>
        <div data-scroll-section className="mt-[200px]">
          <FixedContainer className="h-screen flex flex-col justify-center items-center gap-28 text-white font-source">
            <button
              className="border-4 border-white p-4 text-3xl w-[300px]"
              onClick={() => router.push("/explore")}
            >
              Get Started
            </button>
            <Marquee className="text-2xl" gradient={false} speed={15}>
              {BENEFITS.join(" | ")}
            </Marquee>
          </FixedContainer>
        </div>
        <div data-scroll-section>
          <Footer />
        </div>
      </div>
    </LocomotiveScrollProvider>
  );
};

export default Home;
