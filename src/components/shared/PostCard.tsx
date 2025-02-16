import { useUserContext } from "@/context/AuthContext";
import { multiFormatRelativeDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStatistics from "./PostStatistics";

type PostCardProps = {
    post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext();

    if (!post.creator) return;

    return (
        <div className="post-card">
            <div className="flex-between">
                <div className="flex items-center gap-3 mb-2">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img
                            src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            draggable="false"
                            className="select-none rounded-full w-12 lg:h-12"
                            alt="creator"
                        />
                    </Link>

                    <div className="flex flex-col">
                        <Link to={`/profile/${post.creator.$id}`}>
                            <div className="flex gap-2 flex-between">
                                <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
                                <p className="small-regular text-light-3">@{post.creator.username}</p>
                            </div>
                            <div className="text-left flex gap-2 text-light-3">
                                <p className="subtle-semibold lg:small-regular">
                                    {multiFormatRelativeDateString(post.$createdAt)}
                                </p>
                                <p className="subtle-semibold lg:small-regular">•</p>
                                <p className="subtle-semibold lg:small-regular">
                                    {post.location}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
                <Link to={`/edit-post/${post.$id}`} className={`${user.id !== post.creator.$id && "hidden"}`}>
                    <img
                        src="/assets/icons/edit.svg"
                        draggable="false"
                        className="select-none"
                        alt="edit"
                        width={20}
                        height={20}
                    />
                </Link>
            </div>
            <Link state={{ fromInternal: true }} to={`/posts/${post.$id}`}>
                <div className="small-medium lg:base-medium py-3">
                    <p>{post.caption}</p>
                    <ul className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag: string) => (
                            <li key={tag} className="text-light-3">
                                #{tag.toLowerCase()}
                            </li>
                        ))}
                    </ul>
                </div>
                <img
                    src={post.imageUrl}
                    draggable="false"
                    className="select-none post-card_img"
                    alt="post-image"
                />
            </Link>

            <PostStatistics post={post} userId={user.id} />
        </div>
    )
}

export default PostCard