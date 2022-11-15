import React, { FC, useRef } from "react";
import Label from "./Label";

type Type =
  | "text"
  | "password"
  | "email"
  | "search"
  | "number"
  | "datetime-local";

export interface Props {
  name: string;
  value?: string | number;
  label?: string;
  className?: string;
  inputClassName?: string;
  id?: string;
  step?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: Type;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
}

const Input: FC<Props> = ({
  className,
  inputClassName,
  label,
  name,
  id = name,
  type = "text",
  disabled = false,
  placeholder,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(undefined);
  const defaultInputClassName =
    "w-full p-2 bg-black text-white font-source leading-normal  focus:outline-none  appearance-none";
  const defaultClassName =
    "flex flex-row mt-2 border rounded-md border-white hover:border-green focus:border-green bg-black";

  const mainInputClass =
    "flex-grow flex align-center items-center py-2 px-2 w-[250px]";

  return (
    <div>
      {label && <Label id={id}>{label}</Label>}
      <div className={className ?? defaultClassName}>
        <div className={mainInputClass}>
          <input
            {...props}
            ref={inputRef}
            id={id}
            name={name}
            disabled={disabled}
            className={inputClassName ?? defaultInputClassName}
            type={type}
            autoComplete="off"
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
