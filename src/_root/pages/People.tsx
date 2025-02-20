import PostFilter from '@/components/shared/PostFilter';
import Spinner from '@/components/shared/Spinner';
import UserCard from '@/components/shared/UserCard';
import UserSearchResults from '@/components/shared/UserSearchResults';
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce';
import { useGetInfiniteUsers, useSearchUsers } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';

const People = () => {
  const { ref, inView } = useInView();
  const { data: users, fetchNextPage, hasNextPage } = useGetInfiniteUsers();

  const [searchValue, setSearchValue] = useState('');
  const [selectedSort, setSelectedSort] = useState("All");

  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedValue);

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue])

  if (!users) {
    return (
      <div className="flex-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== '';
  const shouldShowUsers = !shouldShowSearchResults && users?.pages.every((item) => item?.documents.length === 0)

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            draggable="false"
            className="select-none"
            alt="people"
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>People</h2>
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
            placeholder='Search users by name or username...'
            className='user-search'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        {shouldShowSearchResults ? (
          <h3 className="body-bold md:h3-bold">Search Results For "{debouncedValue}"</h3>
        ) : (
          <h3 className="body-bold md:h3-bold">{selectedSort} {selectedSort === 'All' && 'Users'}</h3>
        )
        }

        <PostFilter selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
      </div>

        {shouldShowSearchResults ? (
          <UserSearchResults
            isSearchFetching={isSearchFetching}
            searchedUsers={searchedUsers}
            searchQuery={debouncedValue}
          />
        ) : shouldShowUsers ? (
          <p className="text-light-4 mt-10 text-center w-full">No users found</p>
        ) : (
          <div className="flex flex-wrap gap-9 w-full max-w-5xl user-grid">
            {users?.pages.flatMap((item) =>
              item?.documents.map((user: Models.Document) => (
                <UserCard key={user.$id} creator={user} />
              ))
            )}
          </div>
        )}

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10 lg:mb-0 md:mb-0 mb-44">
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default People