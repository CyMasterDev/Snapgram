import React, { useState, useEffect } from "react";
import PostStatistics from "@/components/shared/PostStatistics";
import Spinner from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetCurrentUser, useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { multiFormatRelativeDateString } from "@/lib/utils";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

const PostDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { user } = useUserContext();

  // State to control the visibility of the back button
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    // 1. If we navigated internally, location.state.fromInternal should be true.
    if (location.state?.fromInternal) {
      setShowBackButton(true);
      return;
    }

    // 2. Otherwise, check if a referrer exists and is on the same domain.
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        if (referrerUrl.hostname === window.location.hostname) {
          setShowBackButton(true);
        } else {
          setShowBackButton(false);
        }
      } catch (error) {
        console.error("Error parsing the referrer URL:", error);
        setShowBackButton(false);
      }
    } else {
      // 3. No referrer → likely not an internal navigation.
      setShowBackButton(false);
    }
  }, [location]);

  const handleDeletePost = () => {
    // Implement delete logic here
  };

  return (
    <div className="post_details-container">
      {/* Use a conditional that applies "hidden" if showBackButton is false */}
      <div className={showBackButton ? "md:flex max-w-5xl w-full" : "hidden"}>
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img src="/assets/icons/back.svg" alt="back" width={24} height={24} />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPending || !post ? (
        <Spinner />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img select-none"
            draggable="false"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img
                  src={post?.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full select-none"
                  draggable="false"
                />
                <div className="flex gap-1 flex-col">
                  <div className="flex gap-2 flex-between">
                    <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
                    <p className="small-regular text-light-3">@{post.creator.username}</p>
                  </div>
                  <div className="flex gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatRelativeDateString(post?.$createdAt)}
                    </p>
                    <p className="subtle-semibold lg:small-regular">•</p>
                    <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/edit-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                    draggable="false"
                    className="select-none"
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                    className="select-none"
                    draggable="false"
                  />
                </Button>
              </div>
            </div>

            <div className="flex flex-col flex-1 w-full small-medium lg:base-medium">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2 flex-wrap">
                {post?.tags.map((tag: string, index: string) => (
                  <li key={`${tag}${index}`} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>

              <hr className="border w-full border-dark-4/80 mt-5" />
            </div>

            <div className="w-full">
              <PostStatistics post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
