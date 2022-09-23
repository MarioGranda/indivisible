import React, { FC, useState } from "react";
import { Comment } from "@/shared/models";
import TextArea from "./TextArea";
import { MdClose } from "react-icons/md";
import { publish } from "../utils/createComment";

interface Props {
  proposalId: number;
  comments: Comment[];
  className?: string;
}

const Post: FC<Props> = ({ proposalId, comments, className }) => {
  const [showText, setShowText] = useState(true);
  const [isReplyActive, setIsReplyActive] = useState(false);
  const [reply, setReply] = useState(null);

  const threadComments = comments.map((comment, i) => (
    <div key={i} className="py-6">
      {showText && (
        <div className="flex flex-col">
          <div className="border border-white rounded-md w-full p-2 bg-black text-white font-source py-4 px-8">
            <p>{comment.text}</p>
          </div>
          {i === comments.length - 1 && (
            <button
              className="flex gap-5 items-center place-self-end rounded-md bg-black border mt-5 p-4 enabled:hover:border-green disabled:opacity-50 mb-10"
              onClick={() => setIsReplyActive(true)}
              disabled={isReplyActive}
            >
              Reply
            </button>
          )}
        </div>
      )}
      {isReplyActive && i === comments.length - 1 && (
        <div className="flex flex-col">
          <div className="self-end">
            <MdClose
              className="cursor-pointer"
              size={30}
              onClick={() => setIsReplyActive(false)}
            />
          </div>
          <TextArea
            name="replyText"
            value={reply ?? ""}
            onChange={(e) => setReply(e.target.value)}
            placeholder=""
            className="w-full"
          />
          <button
            className="flex gap-5 items-center place-self-end rounded-md bg-black border mt-5 p-4 enabled:hover:border-green disabled:opacity-50 mb-5"
            disabled={!reply}
            onClick={uploadReply}
          >
            Publish
          </button>
        </div>
      )}
    </div>
  ));
  const uploadReply = async () => {
    const data = {
      userId: 1,
      text: reply,
      proposalId,
      headComment: comments[0].headComment,
      title: null,
    };
    await publish(data);
  };

  return (
    <div className="flex flex-col text-white font-source w-full">
      {threadComments}
    </div>
  );
};

export default Post;
