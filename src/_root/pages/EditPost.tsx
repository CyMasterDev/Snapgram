import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Spinner from "@/components/shared/Spinner";
import { PostForm } from "@/components/forms/PostForm";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && post && post.creator.$id !== user.id) {
      navigate("/");
    }
  }, [isPending, post, user, navigate]);

  if (isPending) return <Spinner />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            draggable="false"
            className="select-none"
            alt="edit"
          />
          <h2 className="h3-bold md:h-2-bold text-left w-full">Edit Post</h2>
        </div>

        <PostForm action="Edit" post={post} />
      </div>
    </div>
  );
};

export default EditPost;
