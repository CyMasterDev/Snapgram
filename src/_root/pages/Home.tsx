import PostList from "@/components/shared/PostList";
import Spinner from "@/components/shared/Spinner";
import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetInfinitePosts, useGetRecentPosts, useGetTopFollowedUsers, useGetTopLikedPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();
  const { data: creators, isPending: isUserLoading } = useGetTopFollowedUsers(10);
  const { user } = useUserContext();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView])

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  //const postArray = posts ? posts : [];

  const filteredCreators = creators?.filter(
    (creator) => creator.$id !== user?.id
  );

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img
              src="/assets/icons/home.svg"
              width={36}
              height={36}
              draggable="false"
              className="select-none"
              alt="home"
            />
            <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
          </div>
          {!posts ? (
            <Spinner />
          ) : (
            posts.pages.map((item, index) => (
              <PostList key={`page-${index}`} posts={item?.documents} />
            ))
          )}
          {hasNextPage && (
            <div ref={ref} className="mt-10 lg:mb-0 md:mb-0 mb-44">
              <Spinner />
            </div>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Popular Creators</h3>
        {isUserLoading && !creators ? (
          <Spinner />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {filteredCreators?.map((creator) => (
              <li key={creator.$id}>
                <UserCard creator={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;