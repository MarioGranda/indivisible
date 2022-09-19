import { User } from "@/shared/models";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  topMembers: User[];
}

const TopMembers: FC<Props> = ({ topMembers }) => {
  return (
    <div className="col-span-1 h-[300px] flex flex-col gap-4 items-center text-3xl border-2 rounded-md border-white py-2">
      <span className="text-3xl">Top members</span>
      {topMembers.map((user, i) => (
        <div key={user.id} className="grid grid-cols-3 gap-4  mx-4">
          <div>
            #{i + 1 + " "}
            <Image
              src={user.avatar}
              width={30}
              height={30}
              alt={`${user.avatar} image`}
              className=""
            />
          </div>
          <div className="items-self-end">
            {user.address.substring(0, 6) + "..."}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopMembers;
