import FixedContainer from "@/client/layouts/FixedContainer";
import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
import Footer from "@/client/components/Footer";
import {
  LocomotiveScrollProvider,
  useLocomotiveScroll,
} from "react-locomotive-scroll";
import {
  MdAttachMoney,
  MdDoNotTouch,
  MdElectricBike,
  MdFamilyRestroom,
  MdPhoneIphone,
} from "react-icons/md";
import { TbRouter } from "react-icons/tb";
import { FaHandHoldingWater, FaHandshake } from "react-icons/fa";
import { HiShieldCheck } from "react-icons/hi";
import {
  GiBrain,
  GiDiscussion,
  GiHealingShield,
  GiScrollQuill,
  GiVote,
} from "react-icons/gi";
import Marquee from "react-fast-marquee";
import { BENEFITS } from "@/client/utils/benefits";
import { useRouter } from "next/router";
import {
  fetchStrapiBullets,
  fetchStrapiHomePage,
} from "@/backend/services/strapi";
import { BsDot } from "react-icons/bs";
import { AiFillBank } from "react-icons/ai";

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
          <FixedContainer className="flex flex-col gap-20">
            <p className="w-[624px] text-white font-source text-2xl">
              Indivisible is a<b> global nonprofit federation </b>of independent
              tenants groups and common interest coalitions, united in
              bargaining power and member benefits to improve access to and
              affordability of quality of life services.
            </p>
            <div className="place-self-end">
              <p className="text-white font-source text-3xl pb-6 font-bold">
                Mission
              </p>
              <p className="w-[624px] text-white font-source text-2xl border-4 border-white p-6">
                To promote the self-determination and economic and cultural
                empowerment of impacted tenants around the globe, regardless of
                age, gender, race, or unique identity through the linking of
                existing associations and by organizing new groups of tenants.{" "}
              </p>
            </div>
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
          <FixedContainer className="flex flex-col gap-44 h-[1500px]">
            <div className="flex text-white font-source">
              <div className="flex-col">
                <h2 className="text-5xl py-4 mb-5">Org Creation</h2>
                <div className="flex gap-20">
                  <div className="flex-col">
                    <Image
                      src="/static/images/ny-aereal.png"
                      width="370"
                      height="255"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex-col md:mt-48">
                    <Image
                      src="/static/images/berlin-aereal.jpeg"
                      width="370"
                      height="255"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-col w-[600px] ml-20 mt-16">
                <h3 className="text-3xl py-4">New York</h3>
                <h4 className="text-xl">
                  50+ well established tenants associations.
                </h4>
                <h3 className="text-3xl py-4">Berlin</h3>
                <h4 className="text-xl">
                  ~10% of residents are part of one of the two largest
                  Mieterverein (renters associations).
                </h4>
                <h3 className="text-3xl py-4">Your city</h3>
                <h4 className="text-xl">
                  With raising rent and living costs and changing city politics,
                  now is an opportune time to organize and unite.
                </h4>
              </div>
            </div>
            <div className="w-[800px] text-white font-source place-self-center relative">
              <div
                data-scroll
                data-scroll-direction="vertical"
                data-scroll-speed="1"
                ref={borderIn}
                className="absolute left-0 top-0 w-[700px] h-[450px] border border-white"
              ></div>
              <div
                ref={borderOut}
                data-scroll
                data-scroll-direction="horizontal"
                data-scroll-speed="-1"
                className="absolute left-0 top-0 w-[700px] h-[450px] border border-white"
              ></div>
              <div className="flex py-10 px-16">
                <div className="flex flex-col">
                  <h2 className="text-5xl py-4">Governance</h2>
                  <div className="flex items-center py-4">
                    <GiBrain size={40} />
                    <p className="px-4 text-2xl">Ideate</p>
                  </div>
                  <div className="flex items-center pb-4">
                    <GiDiscussion size={40} />
                    <p className="px-4 text-2xl">Discuss</p>
                  </div>
                  <div className="flex items-center pb-4">
                    <GiScrollQuill size={40} />
                    <p className="px-4 text-2xl">Propose</p>
                  </div>
                  <div className="flex items-center pb-4">
                    <GiVote size={40} />
                    <p className="px-4 text-2xl">Vote</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center w-[300px] h-[300px] self-center mt-16">
                  Create a post about an issue you’d like to address. Open up
                  the discussion to comments and up/down feedback. If it gains
                  traction, refine the text, promote the comment to a proposal,
                  and put it to a vote. Who can vote and voting periods are all
                  set with easy drop down and smart form functions.
                </div>
                {/* <h2 className="text-xl py-4">
                Create a post about an issue you’d like to address. Open up the
                discussion to comments and up/down feedback. If it gains
                traction, refine the text, promote the comment to a proposal,
                and put it to a vote. Who can vote and voting periods are all
                set with easy drop down and smart form functions.
                </h2> */}
              </div>
            </div>
          </FixedContainer>
        </div>
        <div id="federated-nested-councils" data-scroll-section className="">
          <FixedContainer className="flex flex-col gap-10 h-[800px]">
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
              <h3 className="text-xl py-4">
                Uniting across blockchains has never been easier.
                <p>
                  Build <b>coalitions</b> with others based on location or
                  interest.{" "}
                </p>
              </h3>
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
                width="700"
                height="300"
              />
            </div>
          </FixedContainer>
        </div>
        <div id="collective-negotiation" data-scroll-section className="">
          <FixedContainer className="flex flex-col gap-20 h-[600px]">
            <div
              className="w-[624px] text-white font-source"
              ref={coalitionImage}
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="-0.8"
            >
              <h2 className="text-5xl py-4 whitespace-nowrap">
                Collective Negotiation
              </h2>
              <h3 className="text-xl py-4">
                As a group of tenants with common interests we’ll work together
                to seek out the best bargains to meet our members needs and
                reduce your cost of living expenses. With your group of family,
                friends, roommates, or building, select the deals that suit your
                needs and your wallet. Propose a plan, comment and vote on it,
                and automatically split the bill and the savings.
              </h3>
            </div>
            {/* <div
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
            </div> */}
          </FixedContainer>
        </div>
        <div id="about" data-scroll-section className="h-screen mb-[700px]">
          <FixedContainer className="flex flex-col gap-52 text-white font-source">
            <p
              data-scroll
              data-scroll-sticky
              data-scroll-target="#about"
              data-scroll-repeat
              className="pt-44 w-[524px] text-4xl"
            >
              Services & Benefits
              <p className="pt-8 text-xl">
                Members receive group rates & discounts just like family and
                business plans & select credit card holders.
              </p>
            </p>
            <div className="pl-20 w-[624px] place-self-end">
              <h3 className="flex gap-5 text-2xl pt-10 pb-5 items-center">
                <MdPhoneIphone size={40} />
                Cellular & data.
              </h3>
              <h3 className="flex gap-5 text-2xl pt-10 pb-5 items-center">
                <TbRouter size={40} />
                Home cable & Internet.
              </h3>
              <h3 className="flex gap-5 text-2xl pt-10 pb-5 items-center">
                <HiShieldCheck size={40} />
                Renters/Travel insurance.
              </h3>
              <h3 className="flex gap-5 text-2xl pt-10 pb-5 items-center">
                <MdElectricBike size={40} />
                Community e-bike & car share.
              </h3>
              <h3 className="flex gap-5 text-2xl pt-10 pb-5 items-center">
                <AiFillBank size={40} />
                Community banking & microloans.
              </h3>
              <h3 className="flex gap-5 text-2xl pt-10 pb-5 items-center">
                <FaHandHoldingWater size={40} />
                Water/air quality testing.
              </h3>
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
                className="absolute left-0 top-0 w-[600px] h-[640px] border border-white"
              ></div>
              <div
                ref={borderOut}
                data-scroll
                data-scroll-direction="horizontal"
                data-scroll-speed="-0.5"
                className="absolute left-0 top-0 w-[600px] h-[640px] border border-white"
              ></div>
              <div className="py-10 px-16 w-[600px]">
                <h2 className="text-5xl py-4">Community Entrepreneurship</h2>
                Through partnership with our members and cooperative-style
                financial institutions and credit unions, we hope to make
                affordable loans together to support your projects that bring
                life and fill the needs that are not being met in your
                neighborhoods, by offering capital, without putting you in debt.{" "}
              </div>
              <div className="pl-20">
                <h3 className="flex gap-5 text-xl">
                  <BsDot size={40} />
                  Food cooperative.
                </h3>
                <h3 className="flex gap-5 text-xl">
                  <BsDot size={40} />
                  Coworking space.
                </h3>
                <h3 className="flex gap-5 text-xl">
                  <BsDot size={40} />
                  Pre-k & aftercare.
                </h3>
                <h3 className="flex gap-5 text-xl">
                  <BsDot size={50} />
                  Recreational, educational & artistic programming.
                </h3>
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
            <Marquee className="text-2xl" gradient={false} speed={40}>
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
