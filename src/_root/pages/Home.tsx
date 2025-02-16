import PostCard from "@/components/shared/PostCard";
import Spinner from "@/components/shared/Spinner";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();

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
          {isPostLoading && !posts ? (
            <Spinner />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id}/>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home