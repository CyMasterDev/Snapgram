import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import FollowButton from "./FollowButton";

type UserCardProps = {
    creator: Models.Document;
}

const UserCard = ({ creator }: UserCardProps) => {
    const { user } = useUserContext();

    return (
        <div className="user-card">
            <Link to={`/profile/${creator.$id}`}>
                <div className="flex-center flex-col gap-1">
                    <img
                        src={creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        alt="creator"
                        className="rounded-full w-14 h-14 select-none"
                        draggable="false"
                    />
                    <p className="base-medium text-light-1 text-center line-clamp-1">
                        {creator.name}
                    </p>
                    <p className="small-regular text-light-3 text-center line-clamp-1">
                        @{creator.username}
                    </p>
                </div>

            </Link>
            {user?.id !== creator.$id && (
                <FollowButton userId={user.id} followingUserId={creator.$id} />
            )}
        </div>
    )
}

export default UserCard