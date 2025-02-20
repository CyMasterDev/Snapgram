import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import Spinner from "@/components/shared/Spinner";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetInfiniteUserPosts,
  useGetInfiniteUserLikedPosts,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import PostGrid from "@/components/shared/PostGrid";
import { formatNumbers } from "@/lib/utils";
import FollowButton from "@/components/shared/FollowButton";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { ref, inView } = useInView();
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const { data: currentUser } = useGetUserById(id || "");

  const followers = currentUser?.followers.length || 0;
  const following = currentUser?.following.length || 0;

  const { data: posts, isPending: isUserPostsLoading, fetchNextPage: fetchMorePosts, hasNextPage: hasMorePosts } = useGetInfiniteUserPosts(id || "");

  const { data: likedPosts, isPending: isUserLikedPostsLoading, fetchNextPage: fetchMoreLikedPosts, hasNextPage: hasMoreLikedPosts } = useGetInfiniteUserLikedPosts(id || "");

  useEffect(() => {
    if (!inView) return;

    if (pathname.includes("liked-posts") && hasMoreLikedPosts) {
      fetchMoreLikedPosts();
    } else if (hasMorePosts) {
      fetchMorePosts();
    }
  }, [inView]);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Spinner />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full select-none"
            draggable="false"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={formatNumbers(followers)} label={followers === 1 ? "Follower" : "Followers"} />
              <StatBlock value={formatNumbers(following)} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex xl:pt-4 lg:pt-4 pt-0 justify-center gap-4">
            {user.id === currentUser.$id ? (
              <Link to={`/edit-profile/${currentUser.$id}`} className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-xl">
                <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} draggable="false" className="select-none" />
                <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
              </Link>
            ) : (
              <FollowButton userId={user.id} followingUserId={currentUser.$id} />
            )}
          </div>
        </div>
      </div>

      <div className="flex max-w-5xl w-full">
        <Link to={`/profile/${id}`} className={`profile-tab rounded-l-xl ${pathname === `/profile/${id}` ? "!bg-dark-3" : ""}`}>
          <img src="/assets/icons/posts.svg" alt="posts" width={20} height={20} draggable="false" className="select-none" />
          Posts
        </Link>
        <Link to={`/profile/${id}/liked-posts`} className={`profile-tab rounded-r-xl ${pathname === `/profile/${id}/liked-posts` ? "!bg-dark-3" : ""}`}>
          <img src="/assets/icons/like.svg" alt="like" width={20} height={20} draggable="false" className="select-none" />
          Liked Posts
        </Link>
      </div>

      <Routes>
        <Route
          index
          element={
            <>
              <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {posts?.pages.some((item) => item.documents.length > 0) ? (
                  posts.pages.map((item, index) => (
                    <PostGrid key={`page-${index}`} posts={item.documents} />
                  ))
                ) : !isUserPostsLoading && (
                  <div className="flex-col items-center text-center w-full mt-10">
                    <img
                      src="/assets/icons/file-upload.svg"
                      alt="posts"
                      className="mx-auto mb-4 select-none"
                      draggable="false"
                      height={100}
                      width={100}
                    />
                    <p className="text-light-3">No posts here yet...</p>
                    {currentUser.$id === user.id ? (
                      <p className="text-light-4 text-sm">
                        Start sharing your thoughts and make this space yours!
                      </p>
                    ) : currentUser.$id != user.id && (
                      <p className="text-light-4 text-sm">
                        Check back later to see if this user has posted!
                      </p>
                    )}
                  </div>
                )}
              </div>
              {!posts && (
                <div className="mt-10 lg:mb-0 md:mb-0 mb-44">
                  <Spinner />
                </div>
              )
              }
              {hasMorePosts && (
                <div ref={ref} className="mt-10 lg:mb-0 md:mb-0 mb-44">
                  <Spinner />
                </div>
              )}
            </>
          }
        />
        <Route
          path="liked-posts"
          element={
            <>
              <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {likedPosts?.pages.some((item) => item.documents.length > 0) ? (
                  likedPosts.pages.map((item, index) => (
                    <PostGrid key={`liked-page-${index}`} posts={item.documents} />
                  ))
                ) : !isUserLikedPostsLoading && (
                  <div className="flex-col items-center text-center w-full mt-10">
                    <img
                      src="/assets/icons/file-upload.svg"
                      alt="posts"
                      className="mx-auto mb-4 select-none"
                      draggable="false"
                      height={100}
                      width={100}
                    />
                    <p className="text-light-3">No liked posts yet...</p>
                    {currentUser.$id === user.id ? (
                      <p className="text-light-4 text-sm">
                        Find something you love and give it a like!
                      </p>
                    ) : (
                      <p className="text-light-4 text-sm">
                        It appears this user hasn't liked anything...
                      </p>
                    )}
                  </div>
                )}
              </div>
              {!likedPosts && (
                <div className="mt-10 lg:mb-0 md:mb-0 mb-44">
                  <Spinner />
                </div>
              )
              }
              {hasMoreLikedPosts && (
                <div ref={ref} className="mt-10 lg:mb-0 md:mb-0 mb-44">
                  <Spinner />
                </div>
              )}
            </>
          }
        />
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;