import { FC, useState } from "react";

interface Props {
  onChange: (boolean) => void;
}

const Toggle: FC<Props> = ({ onChange }) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="relative flex flex-col justify-center overflow-hidden">
      <div className="flex">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            readOnly
          />
          <div
            onClick={() => {
              setEnabled(!enabled);
              onChange(!enabled);
            }}
            className="w-16  h-8 bg-gray-dark rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green"
          ></div>
          <span className="text-white font-source text-lg px-4">
            {enabled ? "Yes" : "No"}
          </span>
        </label>
      </div>
    </div>
  );
};

export default Toggle;
