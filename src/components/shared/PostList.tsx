import { Models } from "appwrite";
import PostCard from "./PostCard";

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
                <p className="text-light-4 mt-10 text-center w-full">That's all we have! Come back later for more posts!</p>
            )}
        </div>
    )
}

export default PostList;