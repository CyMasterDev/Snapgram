import { useUserContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStatistics from "./PostStatistics";

type PostGridProps = {
  posts?: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}

const PostGrid = ({ posts, showUser = true, showStats = true }: PostGridProps) => {
  const { user } = useUserContext();
  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post.$id} className="relative h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link" state={{ fromInternal: true }}>
            <img
              src={post.imageUrl}
              className="select-none h-full w-full object-cover"
              draggable="false"
              alt="post"
            />
          </Link>

          <div className="grid-post_user w-full flex items-center justify-between">
            {showUser && (
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <img
                  src={post.creator.imageUrl}
                  draggable="false"
                  className="select-none bg-dark-2 h-8 w-8 rounded-full"
                  alt="creator"
                />
                <p className="truncate text-ellipsis whitespace-nowrap base-medium text-light-1 min-w-0 flex-1 sm:small-medium">
                  {post.creator.name}
                </p>
              </div>
            )}
            {showStats && <PostStatistics post={post} userId={user.id} />}
          </div>
        </li>
      ))
      }
    </ul >
  )
}

export default PostGrid