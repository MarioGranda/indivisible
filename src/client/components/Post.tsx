import React, { FC } from "react";
import classNames from "classnames";
import FixedContainer from "../layouts/FixedContainer";
import { Comment } from "@/shared/models";

interface Props {
  comment: Comment;
  className?: string;
}

const Post: FC<Props> = ({ comment, className }) => {
  const _class = classNames("font-source text-white", className);

  return <div className="bg-gray rounded-xl">Hola</div>;
};

export default Post;
