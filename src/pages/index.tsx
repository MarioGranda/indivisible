import FixedContainer from "@/client/layouts/FixedContainer";
import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
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
import {
  fetchStrapiBullets,
  fetchStrapiHomePage,
} from "@/backend/services/strapi";

interface Section {
  title: string;
  text: string;
  subtitle?: string;
  sectionTitle?: string;
}
interface Props {
  paragraphs: Section[];
  bullets: Section[];
}

const Home: FC<Props> = ({ paragraphs, bullets }) => {
  const borderIn = useRef<HTMLDivElement>(null);
  const borderOut = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef(null);
  const coalitionImage = useRef<HTMLDivElement>(null);
  const router = useRouter();

  let isDown = false;

  const handleZoom = (scroll) => {
    scroll.on("scroll", (args) => {
      const scrollY = args.scroll.y;

      console.log(args.currentElements);
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
            <p className="w-[624px] text-white font-source text-2xl">
              Indivisible is a<b> global nonprofit federation </b>of independent
              tenants groups and common interest coalitions, united in
              bargaining power and member benefits to improve access to and
              affordability of quality of life services.
            </p>
            <p className="w-[624px] place-self-end text-white font-source text-2xl">
              Our <b>mission</b> is to promote the self-determination and
              economic and cultural security of impacted tenants around the
              globe, regardless of age, gender, race, or unique identity through
              the linking of existing associations and by organizing new groups
              of tenants.{" "}
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
          <FixedContainer className="flex flex-col gap-10 h-[1500px]">
            <div className="w-[624px] text-white font-source">
              <h2 className="text-5xl py-4">Org Creation</h2>
              <h3 className="text-3xl py-4">
                There are over 50 well established tenants associations in New
                York alone.
              </h3>
              In Berlin almost 10% of the city population belong to one of the
              two main tenants associations and the trend is common across the
              world. With raising rent and living costs and changing city
              politics, now is an opportune time to organize and unite.
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
                <h2 className="text-5xl py-4">Governance</h2>
                Create a post about an issue you’d like to address. Open up the
                discussion to comments and up/down feedback. If it gains
                traction, refine the text, promote the comment to a proposal,
                and put it to a vote. Who can vote and voting periods are all
                set with easy drop down and smart form functions.
              </div>
            </div>
          </FixedContainer>
        </div>
        <div id="federated-nested-councils" data-scroll-section className="">
          <FixedContainer className="flex flex-col gap-44 h-[1300px]">
            <div
              className="w-[624px] text-white font-source"
              ref={coalitionImage}
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="-0.8"
            >
              <h2 className="text-5xl py-4 whitespace-nowrap">
                Federated Nested Councils
              </h2>
            </div>
            <div
              className="place-self-end"
              ref={coalitionImage}
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="0.8"
            >
              <Image
                src="/static/images/nested-councils.png"
                width="900"
                height="400"
              />
            </div>
          </FixedContainer>
        </div>
        <div id="collective-negotiation" data-scroll-section className="">
          <FixedContainer className="flex flex-col gap-44 h-[1300px]">
            <div
              className="w-[624px] text-white font-source place-self-end"
              ref={coalitionImage}
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="0.8"
            >
              <h2 className="text-5xl py-4 whitespace-nowrap">
                Collective Negotiation
              </h2>
            </div>
            <div
              ref={coalitionImage}
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="-0.8"
            >
              <Image
                src="/static/images/nested-councils.png"
                width="900"
                height="400"
              />
            </div>
          </FixedContainer>
        </div>
        <div id="about" data-scroll-section className="h-screen mb-[700px]">
          <FixedContainer className="flex flex-col gap-52 text-white font-source">
            <p
              data-scroll
              data-scroll-sticky
              data-scroll-target="#about"
              data-scroll-repeat
              className="pt-28 w-[624px] text-4xl"
            >
              Services & Benefits
            </p>
            <div className="w-[624px] place-self-end">
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                <MdFamilyRestroom size={40} />
                First Service
              </h3>
              <p className="text-xl">First Service</p>
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                <AiFillHome size={40} />
                Second Service
              </h3>
              <p className="text-xl">Second Service</p>
              <h3 className="flex gap-5 text-3xl pt-10 pb-5">
                <FaHandshake size={40} />
                Third Service
              </h3>
              <p className="text-xl">Third Service</p>
              <h3 className="text-3xl my-5"></h3>
            </div>
          </FixedContainer>
        </div>
        <div data-scroll-section className="">
          <FixedContainer className="flex h-[1300px] gap-20">
            <div className=" text-white font-source relative">
              <div
                data-scroll
                data-scroll-direction="vertical"
                data-scroll-speed="0.5"
                ref={borderIn}
                className="absolute left-0 top-0 w-[500px] h-[320px] border border-white"
              ></div>
              <div
                ref={borderOut}
                data-scroll
                data-scroll-direction="horizontal"
                data-scroll-speed="-0.5"
                className="absolute left-0 top-0 w-[500px] h-[320px] border border-white"
              ></div>
              <div className="py-10 px-16 w-[500px]">
                <h2 className="text-5xl py-4">Homeownership</h2>
                INDV believes in your right to ownership and self management and
                we support renters organizing and negotiating to buy their
                building directly from the landlord.{" "}
              </div>
            </div>
            <div className="w-[624px] text-white font-source relative mt-64">
              <div
                data-scroll
                data-scroll-direction="vertical"
                data-scroll-speed="0.5"
                ref={borderIn}
                className="absolute left-0 top-0 w-[600px] h-[420px] border border-white"
              ></div>
              <div
                ref={borderOut}
                data-scroll
                data-scroll-direction="horizontal"
                data-scroll-speed="-0.5"
                className="absolute left-0 top-0 w-[600px] h-[420px] border border-white"
              ></div>
              <div className="py-10 px-16 w-[600px]">
                <h2 className="text-5xl py-4">Community Entrepreneurship</h2>
                Through partnership with our members and cooperative-style
                financial institutions and credit unions, we hope to make
                affordable loans together to support your projects that bring
                life and fill the needs that are not being met in your
                neighborhoods, by offering capital, without putting you in debt.{" "}
              </div>
            </div>
          </FixedContainer>
        </div>
        <div data-scroll-section className="">
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
        <div data-scroll-section className="h-[250px]">
          <Footer />
        </div>
      </div>
    </LocomotiveScrollProvider>
  );
};

// export const getServerSideProps = async () => {
//   const paragraphs = await fetchStrapiHomePage();
//   const bullets = await fetchStrapiBullets();

//   return {
//     props: {
//       paragraphs: paragraphs
//         .filter((p) => p.attributes.title !== null)
//         .map((p) => ({
//           title: p.attributes.title,
//           text: p.attributes.paragraph,
//           subtitle: p.attributes.subtitle ?? "",
//         })),
//       bullets: bullets
//         .filter((p) => p.attributes.title !== null)
//         .map((p) => ({
//           title: p.attributes.title,
//           text: p.attributes.paragraph,
//           sectionTitle: p.attributes.sectionTitle,
//         })),
//     },
//   };
// };

export default Home;
