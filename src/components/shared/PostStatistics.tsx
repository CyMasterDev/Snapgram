import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";

type PostStatisticsProps = {
    post: Models.Document;
    userId: string;
}

const PostStatistics = ({ post, userId }: PostStatisticsProps) => {
    const likesList = post.likes.map((user: Models.Document) => user.$id );

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } = useDeleteSavedPost();

    const { data: currentUser } = useGetCurrentUser();

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

    useEffect(() => {
        setIsSaved(!!savedPostRecord)
    }, [currentUser])

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes];

        const hasLiked = newLikes.includes(userId);

        if(hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId);
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes);
        likePost({ postId: post.$id, likesArray: newLikes})
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        if(savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else {
            savePost({ postId: post.$id, userId });
            setIsSaved(true);
        }
    }

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img
                src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "assets/icons/like.svg"}
                draggable="false"
                className="select-none cursor-pointer"
                alt="like"
                width={20}
                height={20}
                onClick={handleLikePost}
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="flex gap-2 mr-5 ml-5 flex-center">
                <img
                src="/assets/icons/chat.svg"
                draggable="false"
                className="select-none cursor-pointer"
                alt="like"
                width={20}
                height={20}
                onClick={() => {}}
                />
                <p className="small-medium lg:base-medium">Not Implemented</p>
            </div>
            {isSavingPost || isDeletingSavedPost ? <div className="flex gap-2 ml-5"><Spinner width={20} height={20}/></div> : <div className="flex gap-2 ml-5">
                <img
                src={isSaved ? "/assets/icons/saved.svg" : "assets/icons/save.svg"}
                draggable="false"
                className="select-none cursor-pointer"
                alt="like"
                width={20}
                height={20}
                onClick={handleSavePost}
                />
            </div>}
        </div>
    )
}

export default PostStatistics