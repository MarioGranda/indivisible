import { FC, LegacyRef, ReactNode } from "react";

interface Props {
  className?: string;
  id?: string;
  ref?: LegacyRef<HTMLDivElement>;
  children: ReactNode;
}

const FixedContainer: FC<Props> = ({ className, children, id, ref }) => {
  return (
    <div className="px-4 md:px-6 mx-auto max-w-[1248px]">
      <div className={className} id={id} ref={ref}>
        {children}
      </div>
    </div>
  );
};

export default FixedContainer;
