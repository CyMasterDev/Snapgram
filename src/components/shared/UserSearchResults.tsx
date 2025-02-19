import { Models } from "appwrite";
import Spinner from "./Spinner";
import UserCard from "./UserCard";

type UserSearchResultsProps = {
    isSearchFetching: boolean;
    searchedUsers?: Models.Document[];
    searchQuery: string;
};

const UserSearchResults = ({ isSearchFetching, searchedUsers, searchQuery }: UserSearchResultsProps) => {
    if (!searchQuery && isSearchFetching) return <Spinner />;

    if (searchedUsers && searchedUsers.length > 0) {
        return (
            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {searchedUsers.map((user: Models.Document) => (
                    <UserCard key={user.$id} creator={user} />
                ))}
            </div>
        );
    }

    if ((!searchedUsers || searchedUsers.length === 0) && !isSearchFetching) {
        return (
            <div className="text-light-4 mt-10 text-center w-full">
                {!searchQuery ? <Spinner /> : <p>No results found for "{searchQuery}"</p>}
            </div>
        );
    }

    return null;
};

export default UserSearchResults;