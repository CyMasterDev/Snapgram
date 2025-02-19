import { useUserContext } from "@/context/AuthContext";
import { multiFormatRelativeDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useNavigate } from "react-router-dom";
import PostStatistics from "./PostStatistics";
import Spinner from "./Spinner";
import { Button } from "../ui/button";
import { useDeletePost, useDeleteSavesByPostId } from "@/lib/react-query/queriesAndMutations";
import { toast } from "@/hooks/use-toast";
import FollowButton from "./FollowButton";

type PostCardProps = {
    post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { mutate: deletePost } = useDeletePost();
    const { mutate: deleteSavesByPostId, isPending: isDeletingSavesByPostId } = useDeleteSavesByPostId();

    if (!post.creator) return;

    const handleDeletePost = async () => {
        if (post !== undefined) {
            deletePost({ postId: post?.$id, imageId: post.imageId });
            deleteSavesByPostId({ postId: post?.$id });
            navigate("/");
            toast({
                title: 'Successfully Deleted Post',
                description: 'Done! Your post has been deleted from the platform.',
                variant: 'default'
            })
        }
    };

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
                            <div className="flex gap-2 flex-start">
                                <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
                                <p className="small-regular text-light-3">@{post.creator.username}</p>
                            </div>
                            <div className="text-left flex gap-2 text-light-3">
                                <p className="subtle-semibold lg:small-regular">
                                    {multiFormatRelativeDateString(post.$createdAt)}
                                </p>
                                {post.location && (
                                    <div className="text-left flex gap-2 text-light-3">
                                        <p className="subtle-semibold lg:small-regular">•</p>
                                        <p className="subtle-semibold lg:small-regular">
                                            {post.location}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="flex-center gap-4">
                    <Link to={`/edit-post/${post.$id}`} className={`${user.id !== post.creator.$id && "hidden"}`}>
                        <img
                            src="/assets/icons/edit.svg"
                            draggable="false"
                            className="select-none"
                            alt="edit"
                            width={22}
                            height={22}
                        />
                    </Link>
                    {isDeletingSavesByPostId || !post ? (
                        <Button className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && "hidden"}`} variant="ghost">
                            <Spinner />
                        </Button>
                    ) : (
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
                    )}
                </div>
            </div>
            <Link state={{ fromInternal: true }} to={`/posts/${post.$id}`}>
                <div className="small-medium lg:base-medium py-3">
                    <p className="w-full min-w-0 break-words whitespace-normal">{post.caption}</p>
                    {post?.tags != '' && (
                        <ul className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map((tag: string) => (
                                <li key={tag} className="text-light-3 min-w-0 max-w-full">
                                    <p className="w-full min-w-0 break-words whitespace-normal">
                                        #{tag.toLowerCase()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
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