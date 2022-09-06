import React, { ChangeEvent, FC, useRef, useState } from "react";
import Label from "./Label";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";
import Image from "next/image";
import { AiOutlineFileAdd } from "react-icons/ai";
import { ContentFileType } from "@/shared/models";

export interface Props {
  name: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  contentFile: ContentFileType;
  size?: number;
  value?: string;
  className?: string;
  id?: string;
}

const FileInput: FC<Props> = ({
  className,
  name,
  id = name,
  onFileChange,
  contentFile,
  size = 50,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        hidden
        id={id}
        name={name}
        ref={fileRef}
        type="file"
        accept="image/png, image/jpeg, audio/mpeg"
        onChange={onFileChange}
        multiple
      />
      <span className={className}>
        {contentFile ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {contentFile.image.preview && (
              <div>
                <Image
                  src={contentFile.image.preview}
                  width="350"
                  height="255"
                  alt="nft preview"
                  className="rounded mt-4 object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <AiOutlineFileAdd
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer fill-white"
            size={size}
          />
        )}
      </span>
    </div>
  );
};

export default FileInput;
