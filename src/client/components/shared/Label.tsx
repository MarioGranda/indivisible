import { FC, ReactNode } from "react";

interface Props {
  id: string | undefined;
  className?: string;
  children: ReactNode;
  hasFocus?: boolean;
}

const Label: FC<Props> = ({ id, children }) => (
  <label
    htmlFor={id}
    className="text-13 text-white font-source leading-normal font-medium"
  >
    {children}
  </label>
);

export default Label;
