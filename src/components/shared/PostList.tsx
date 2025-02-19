import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";
import UserCard from "./UserCard";

type PostListProps = {
    posts?: Models.Document[];
}

const PostList = ({ posts }: PostListProps) => {
    return (
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            {posts && posts.length > 0 ? ( // Check if posts is an array and has length
                <ul className="flex flex-col flex-1 gap-9 w-full">
                    {posts.map((post: Models.Document) => (
                            <PostCard post={post} key={post.$id} />
                    ))}
                </ul>
            ) : (
                <p className="text-light-4 mt-10 text-center w-full">No posts yet! Start something extraordinary by <Link className="text-primary-500" to="/create-post">creating a new post</Link></p>
            )}
        </div>
    )
}

export default PostList;