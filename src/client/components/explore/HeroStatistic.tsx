import React, { FC } from "react";

interface Props {
  text: string;
}
const HeroStatistic: FC<Props> = ({ text }) => {
  return (
    <div className="flex items-center">
      <div className="box-border h-10 w-2 border-white border-4 bg-white"></div>
      <span className="flex text-white font-source mx-4 text-2xl">{text}</span>
    </div>
  );
};

export default HeroStatistic;
