import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import PostFilter from "@/components/shared/PostFilter";
import SearchResults from "@/components/shared/SearchResults";
import PostGrid from "@/components/shared/PostGrid";
import { useGetInfinitePosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import useDebounce from "@/hooks/useDebounce";
import Spinner from "@/components/shared/Spinner";
import { useInView } from 'react-intersection-observer'

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();

  const [searchValue, setSearchValue] = useState('');
  const [selectedSort, setSelectedSort] = useState("All");

  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue])

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults && posts?.pages.every((item) => item?.documents.length === 0)

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/compass.svg"
            width={36}
            height={36}
            draggable="false"
            className="select-none"
            alt="explore"
          />
          <h2 className='h3-bold md:h2-bold w-full'>Explore</h2>
        </div>
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
            placeholder='Search posts by caption, location or tags...'
            className='explore-search'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        {shouldShowSearchResults ? (
          <h3 className="body-bold md:h3-bold">Search Results For "{debouncedValue}"</h3>
        ) : (
          <h3 className="body-bold md:h3-bold">{selectedSort} {selectedSort === 'All' && 'Posts'}</h3>
        )
        }

        <PostFilter selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
            searchQuery={debouncedValue}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">That's all we have! Check back later for more posts!</p>
        ) : posts.pages.map((item, index) => (
          <PostGrid key={`page-${index}`} posts={item?.documents} />
        ))}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10 lg:mb-0 md:mb-0 mb-44">
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default Explore