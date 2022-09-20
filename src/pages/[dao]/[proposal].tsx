import { findCommentsByProposalId } from "@/backend/repositories/comments";
import { findProposal } from "@/backend/repositories/proposals";
import Input from "@/client/components/Input";
import Post from "@/client/components/Post";
import TextArea from "@/client/components/TextArea";
import FixedContainer from "@/client/layouts/FixedContainer";
import { publish } from "@/client/utils/createComment";
import { Comment } from "@/shared/models";
import React, { FC, useState } from "react";
import { MdOutlineAdd } from "react-icons/md";

interface Props {
  proposalId: number;
  comments: Comment[];
}

const Proposal: FC<Props> = ({ proposalId, comments }) => {
  const [isNewComment, setIsNewComment] = useState<boolean>(false);
  const [newComment, setNewComment] = useState({
    title: null,
    text: null,
  });

  const postClassName =
    "bg-gray-dark text-white text-13 p-4 rounded-xl w-full outline-none";

  const posts = comments
    .filter((c) => c.id === c.headComment)
    .map((comment) => (
      <Post
        key={comment.id}
        comments={comments.filter((c) => c.headComment === comment.headComment)}
        proposalId={proposalId}
      />
    ));

  const uploadComment = async () => {
    const data = {
      userId: 1,
      text: newComment.text,
      proposalId,
      headComment: null,
      title: newComment.title,
    };
    await publish(data);
  };

  return (
    <div className="explore-bg bg-cover text-white font-source min-h-screen">
      <FixedContainer className="flex flex-col justify-items-center gap-5">
        <button
          className="flex gap-5 items-center rounded-md bg-black border-2 mt-10 mb-10 p-4 w-[270px] hover:border-green"
          onClick={() => setIsNewComment(!isNewComment)}
        >
          <MdOutlineAdd size={40} />
          Start discussion
        </button>
        {isNewComment && (
          <div className="flex flex-col place-items-start">
            <h2 className="text-2xl font-source font-bold pb-5">Title</h2>
            <Input
              name="newCommentTitle"
              value={newComment.title ?? ""}
              required
              type="text"
              onChange={(e) =>
                setNewComment((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <h2 className="text-2xl font-source font-bold pt-10 pb-5">
              Content
            </h2>
            <TextArea
              name="newCommentText"
              value={newComment.text ?? ""}
              onChange={(e) =>
                setNewComment((prev) => ({ ...prev, text: e.target.value }))
              }
              placeholder=""
              className="w-full"
            />
            <button
              className="flex gap-5 items-center place-self-end rounded-md bg-black border mt-5 p-4 enabled:hover:border-green disabled:opacity-50"
              onClick={uploadComment}
              disabled={!newComment.text || !newComment.title}
            >
              Publish
            </button>
          </div>
        )}
        {posts}
      </FixedContainer>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const id = params?.proposal as string;
  const proposal = await findProposal(Number(id));

  if (!proposal) {
    return { notFound: true };
  }

  const comments = await findCommentsByProposalId(proposal.id);

  return {
    props: {
      proposalId: proposal.id,
      comments,
    },
  };
};

export default Proposal;
