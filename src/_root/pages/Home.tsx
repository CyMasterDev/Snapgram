import PostList from "@/components/shared/PostList";
import Spinner from "@/components/shared/Spinner";
import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPosts, useGetTopFollowedUsers, useGetTopLikedPosts } from "@/lib/react-query/queriesAndMutations";

const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetTopLikedPosts();
  const { data: creators, isPending: isUserLoading, isError: isErrorUsers } = useGetTopFollowedUsers(10);
  const { user } = useUserContext();

  const postArray = posts ? posts : [];

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
          {isPostLoading ? (
            <Spinner />
          ) : (
            <PostList posts={postArray} />
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