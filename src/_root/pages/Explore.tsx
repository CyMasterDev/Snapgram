import { useState } from "react";
import { Input } from "@/components/ui/input";
import PostFilter from "@/components/shared/PostFilter";
import SearchResults from "@/components/shared/SearchResults";
import PostGrid from "@/components/shared/PostGrid";
import { useSearchPosts } from "@/lib/react-query/queriesAndMutations";

const Explore = () => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedSort, setSelectedSort] = useState("All");

  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(searchValue)

  //const posts = [];

  //const shouldShowSearchResults = searchValue !== '';
  //const shouldShowPosts = !shouldShowSearchResults && posts?.pages.every((item) => item.documents.length === 0)

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
        <div className='flex gap-1 px-4 w-full rounded-xl bg-dark-4'>
          <img
            src='/assets/icons/search.svg'
            draggable='false'
            className='select-none'
            width={24}
            height={24}
            alt='search'
          />
          <Input
            type='text'
            placeholder='Search Posts...'
            className='explore-search'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">
          {selectedSort} {selectedSort === 'All' && 'Posts'}
        </h3>

        <PostFilter selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
      </div>

      {/*<div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults 
          
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">That's all we have! Check back later for new posts!</p>
        ) : posts.pages.map((item, index) => (
          <PostGrid key={`page-${index}`} posts={item.documents}/>
        ))}
      </div>*/}
    </div>
  )
}

export default Explore