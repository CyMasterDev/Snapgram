import PostGrid from '@/components/shared/PostGrid'
import Spinner from '@/components/shared/Spinner'
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations';
import { Models } from "appwrite";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },

    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="select-none"
          draggable="false"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Spinner />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <div className="flex-col items-center text-center max-w-sm w-full mt-10">
              <img
                src="/assets/icons/file-upload.svg"
                alt="posts"
                className="mx-auto mb-4 select-none"
                draggable="false"
                height={100}
                width={100}
              />
              <p className="text-light-3 base-medium">No saved posts here yet...</p>
              <p className="text-light-4 small-regular">
                You haven't saved any posts yet - bookmark your favorites to find them easily later!
              </p>
            </div>
          ) : (
            <PostGrid posts={savePosts} showStats={false} showUser={false} />
          )}
        </ul>
      )}
    </div>
  )
}

export default Saved