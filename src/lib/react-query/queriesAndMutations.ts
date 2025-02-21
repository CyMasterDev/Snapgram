import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, deleteSavesByPostId, editPost, editUser, followUser, getCurrentUser, getInfinitePosts, getInfiniteUserLikedPosts, getInfiniteUserPosts, getInfiniteUsers, getPostById, getTopFollowedUsers, getUserById, likePost, savePost, searchPosts, searchUsers, signInAccount, signOutAccount, unfollowUser } from '../appwrite/api'
import { IEditPost, IEditUser, INewPost, INewUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string
        }) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_USER_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_USER_LIKED_POSTS]
            });
            
        },
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string, likesArray: string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_USER_LIKED_POSTS]
            })
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string, userId: string }) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useEditPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ post, currentUserId, postCreatorId}: { post: IEditPost, currentUserId: string, postCreatorId: string }) => editPost({post, currentUserId, postCreatorId}),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, imageId }: { postId: string, imageId: string }) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_USER_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_INFINITE_USER_LIKED_POSTS]
            })
        }
    })
}

export const useGetInfinitePosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useSearchPosts = (searchQuery: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchQuery],
        queryFn: () => searchPosts(searchQuery),
        enabled: !!searchQuery,
    })
}

export const useDeleteSavesByPostId = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId }: { postId: string }) => deleteSavesByPostId(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetTopFollowedUsers = (limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_TOP_FOLLOWED_USERS],
        queryFn: () => getTopFollowedUsers(limit),
    });
};

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};

export const useGetInfiniteUserPosts = (userId: string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_USER_POSTS, userId],
        queryFn: ({ pageParam = "" }) => getInfiniteUserPosts({ pageParam, userId }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.documents.length === 0) return null;

            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
    });
};

export const useGetInfiniteUserLikedPosts = (userId: string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_USER_LIKED_POSTS, userId],
        queryFn: ({ pageParam = "" }) => getInfiniteUserLikedPosts({ pageParam, userId }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.documents.length === 0) return null;

            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
    });
};

export const useGetInfiniteUsers = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_USERS],
        queryFn: getInfiniteUsers,
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useSearchUsers = (searchQuery: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_USERS, searchQuery],
        queryFn: () => searchUsers(searchQuery),
        enabled: !!searchQuery,
    })
}

export const useFollowUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, followingUserId }: { userId: string; followingUserId: string }) =>
            followUser(userId, followingUserId),
        onSuccess: () => {
            // Invalidate queries related to followers/following counts so they refresh
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_BY_ID] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TOP_FOLLOWED_USERS] });
        },
    });
};

export const useUnfollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (followRecordId: string) => unfollowUser(followRecordId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_BY_ID] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TOP_FOLLOWED_USERS] });
        },
    });
};

export const useEditUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({userToEdit, currentUserId}: { userToEdit: IEditUser, currentUserId: string}) => editUser({userToEdit, currentUserId}),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
            });
        },
    });
};