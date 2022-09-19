import React, { FC } from "react";

const HeroTitle: FC = () => {
  return (
    <>
      <div className="font-source leading-[3rem] md:pr-5 text-[50px] md:text-7xl lg:text-7x2 text-white uppercase">
        <div className="flex flex-col">
          <h1>
            Join <br />
            <span className="flex flex-row gap-4 items-center">
              <span className="border-8 border-brand w-28 bg-white" />
              <span>Digital</span>
            </span>
          </h1>
        </div>
        <div className="flex gap-3 items-center">Democracy</div>
      </div>

      <h2 className="font-bold font-source text-white max-w-[15rem] md:max-w-none whitespace-pre-line">
        Become a member of{" "}
        <span
          //onClick={() => scrollToElement(nftRef)}
          className="text-brand underline cursor-pointer"
        >
          DAOs
        </span>{" "}
        and contribute to Digital Democracy.
      </h2>
    </>
  );
};

export default HeroTitle;
