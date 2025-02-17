import { Models } from "appwrite";
import Spinner from "./Spinner";
import PostGrid from "./PostGrid";
import { useSearchPosts } from "@/lib/react-query/queriesAndMutations";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
  searchQuery: string
}

const SearchResults = ({ isSearchFetching, searchedPosts, searchQuery }: SearchResultsProps) => {
  if (!searchQuery && isSearchFetching) return <Spinner />

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <PostGrid posts={searchedPosts.documents} />
    )
  }

  if ((!searchedPosts || searchedPosts.documents.length === 0) && !isSearchFetching) {
    return (
      <div className="text-light-4 mt-10 text-center w-full">
        {!searchQuery ? <Spinner /> : <p>No results found for "{searchQuery}"</p>}
      </div>
    );
  }  
}

export default SearchResults