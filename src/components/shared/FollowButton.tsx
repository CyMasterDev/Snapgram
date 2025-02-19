import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useFollowUser, useUnfollowUser, useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import Spinner from "./Spinner";

type FollowButtonProps = {
    userId: string;
    followingUserId: string;
};

const FollowButton = ({ userId, followingUserId }: FollowButtonProps) => {
    const { data: currentUser } = useGetCurrentUser();
    const { mutate: followUser, isPending: isFollowingUser } = useFollowUser();
    const { mutate: unfollowUser, isPending: isUnfollowingUser } = useUnfollowUser();

    const followRecord = currentUser?.following?.find(
        (record: Models.Document) => record.followingUserId.$id === followingUserId
    );

    const [isFollowing, setIsFollowing] = useState(!!followRecord);

    useEffect(() => {
        setIsFollowing(!!followRecord);
    }, [followRecord]);

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isFollowing) {
            const followRecordId = followRecord?.$id;

            if (followRecordId) {
                unfollowUser(followRecordId);
                setIsFollowing(false);
            }
        } else {
            followUser({ userId, followingUserId });
            setIsFollowing(true);
        }
    };

    return (
        <Button
            type="button"
            className="shad-button_primary px-5"
            onClick={handleFollow}
            disabled={isFollowingUser || isUnfollowingUser}
        >
            {(isFollowingUser || isUnfollowingUser) && <Spinner />}
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
};

export default FollowButton;
