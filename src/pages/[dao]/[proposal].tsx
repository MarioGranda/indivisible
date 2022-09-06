import { findCommentsByProposalId } from "@/backend/repositories/comments";
import { findProposal } from "@/backend/repositories/proposals";
import Input from "@/client/components/Input";
import Post from "@/client/components/Post";
import TextArea from "@/client/components/TextArea";
import FixedContainer from "@/client/layouts/FixedContainer";
import { Comment, Proposal } from "@/shared/models";
import React, {
  ChangeEvent,
  FC,
  MouseEventHandler,
  useCallback,
  useState,
} from "react";
import { MdOutlineAdd } from "react-icons/md";

interface Props {
  proposal: Proposal;
  comments: Comment[];
}

const Proposal: FC<Props> = ({ proposal, comments }) => {
  const [isNewComment, setIsNewComment] = useState<boolean>(false);
  const [newComment, setNewComment] = useState(null);

  const postClassName =
    "bg-gray-dark text-white text-13 p-4 rounded-xl w-full outline-none";

  const posts = comments.map((comment, i) => (
    <Post comment={comment} className={postClassName} />
  ));

  // const onInputChange = useCallback(
  //     (e: ChangeEvent<HTMLInputElement>) => {
  //         setNewComment((state) => ({
  //             ...state,
  //             [e.target.name]: e.target.value,
  //         }));
  //     },
  //     [setNewComment]
  // );

  const addComment = () => {};

  return (
    <div className="explore-bg bg-cover text-white font-source min-h-screen">
      <FixedContainer className="flex flex-col justify-items-center gap-5">
        <button
          className="flex gap-5 items-center rounded-xl bg-gray-dark mt-10 p-4 w-[270px]"
          onClick={() => setIsNewComment(!isNewComment)}
        >
          <MdOutlineAdd size={40} />
          Add new comment
        </button>
        {isNewComment && (
          <TextArea
            name="newComment"
            value={newComment ?? ""}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder=""
            inputClassname={postClassName}
          />
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
      proposal,
      comments,
    },
  };
};

export default Proposal;
