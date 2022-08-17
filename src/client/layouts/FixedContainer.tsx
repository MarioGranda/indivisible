import { FC } from "react";

interface Props {
  className?: string;
  children: any
}

const FixedContainer: FC<Props> = ({ className, children }) => {
  return (
    <div className="px-4 md:px-6 mx-auto max-w-[1248px]">
      <div className={className}>{children}</div>
    </div>
  );
};

export default FixedContainer;
