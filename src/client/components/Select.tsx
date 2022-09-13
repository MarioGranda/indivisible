import React, { FC, LegacyRef, useState } from "react";
import Label from "./Label";

export interface Item {
  code: string;
  name: string;
}

export interface Props {
  name: string;
  items: Item[];
  value?: string | number;
  label?: string;
  className?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const Select: FC<Props> = ({
  className,
  label,
  name,
  id = name,
  placeholder,
  items,
  onChange,
  ...props
}) => {
  const [hasFocus, setFocus] = useState(false);

  return (
    <div>
      {label && (
        <Label id={id} hasFocus={hasFocus}>
          {label}
        </Label>
      )}
      <select
        className="font-bold bg-black border border-white disabled:opacity-50 enabled:hover:border-green p-4 focus:outline-none"
        name={name}
        onChange={onChange}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        id={id}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {items.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
