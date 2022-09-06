import React, { FC, useState } from "react";
import Label from "./Label";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";

export interface Props {
  name: string;
  value?: string;
  label?: string;
  className?: string;
  inputClassname?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const TextArea: FC<Props> = ({
  className,
  inputClassname,
  label,
  name,
  id = name,
  ...props
}) => {
  const [hasFocus, setFocus] = useState(false);

  // Clear placeholder on focus & restore when on blur
  const placeholder = hasFocus ? "" : props.placeholder;

  const mainInputClass = 
    "flex-grow flex align-center items-center py-2 text-white rounded-[0.35rem]"
  const defaultInputClassname =
    "placeholder-gray-300 bg-black text-white text-13 py-2 px-4 border border-white font-source w-full hover:border-green focus:outline-none focus:border-green"

  return (
    <div className={className}>
      {label && (
        <Label id={id} hasFocus={hasFocus}>
          {label}
        </Label>
      )}
      <div className="flex flex-row w-full">
        <div className={mainInputClass}>
          <textarea
            {...props}
            id={id}
            name={name}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            className={inputClassname ?? defaultInputClassname}
            autoComplete="off"
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

export default TextArea;
