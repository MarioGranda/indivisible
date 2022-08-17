import React, { FC, ReactNode, useRef, useState } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
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
  label,
  name,
  id = name,
  type = "text",
  disabled = false,
  placeholder,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(undefined);
  let interval; 

  const addStep = () => {
    inputRef.current.value = (Number(inputRef.current.value) + Number(inputRef.current.step)).toString()
  }

  const substractStep = (min: number) => {
    if (Number(inputRef.current.value) > min)
    inputRef.current.value = (Number(inputRef.current.value) - Number(inputRef.current.step)).toString()
  }

  const handleOnClick = (up: boolean) => {
    interval = setInterval(() => {
      up ? addStep() : substractStep(Number(inputRef.current.min))
    }, 100);
  }

  const handleOnUnClick = () => {
    clearInterval(interval);
  }

  const mainInputClass =
    "flex-grow flex align-center items-center py-2 px-2 w-[250px]"

  return (
    <div className={className}>
      {label && (
        <Label id={id}>
          {label}
        </Label>
      )}
      <div className="flex flex-row mt-2 border border-white hover:border-green focus:border-green">
        <div className={mainInputClass}>
          <input
            {...props}
            ref={inputRef}
            id={id}
            name={name}
            disabled={disabled}
            className="w-full py-2 px-4 bg-black text-white font-source leading-normal  focus:outline-none  appearance-none"
            type={type}
            autoComplete="off"
            placeholder={placeholder}
          />
          {/* {
            props.step &&
            <div className="flex flex-col divide-y divide-black">
                <BiUpArrow
                  onMouseDown={() => handleOnClick(true)
                  }
                  onMouseUp={handleOnUnClick
                  }
                  className="cursor-pointer fill-white"
                  size={18}
                />
                <BiDownArrow
                  onMouseDown={() => handleOnClick(false)
                  }
                  onMouseUp={handleOnUnClick
                  }
                  className="cursor-pointer fill-white"
                  size={18}
                />
            </div>
          } */}
        </div>
      </div>
    </div>
  );
};

export default Input;
