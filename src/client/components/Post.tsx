import React, { FC } from "react";
import classNames from "classnames";
import { Comment } from "@/shared/models";

interface Props {
  comment: Comment;
  className?: string;
}

const Post: FC<Props> = ({ className }) => {

  return <div className="bg-gray rounded-xl">Hola</div>;
};

export default Post;
