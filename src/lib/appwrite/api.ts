import { ID, ImageGravity, Models, Query } from 'appwrite';
import { IEditPost, INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    )

    if (!newAccount) throw Error;

    //const avatarUrl = avatars.getInitials(user.name);
    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: new URL(avatarUrl),
    });

    return newUser
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  //imageUrl: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    )

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string; }) {
  try {
    const session = await account.createEmailPasswordSession(user.email, user.password);

    return session
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current"); 7

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      35,
      //super duper optimized quality heheheheheheheheheehehehehehehee
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: 'OK' }
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(10)]
  )

  if (!posts) throw Error;

  return posts;
}

export async function getTopLikedPosts() {
  const postQueries: any[] = [Query.orderDesc("$createdAt"), Query.limit(10)];

  try {
    const postsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postQueries
    );

    if (!postsResponse || !postsResponse.documents) {
      throw Error
    }

    const posts = postsResponse.documents;

    const postsWithLikeCounts = posts.map((post: any) => {
      const likedArray = post.likes;
      const likeCount = Array.isArray(likedArray) ? likedArray.length : 0;
      return { ...post, likeCount };
    });

    postsWithLikeCounts.sort((a, b) => b.likeCount - a.likeCount);

    return postsWithLikeCounts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if (!updatedPost) throw Error;

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )

    if (!updatedPost) throw Error;

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    )

    if (!statusCode) throw Error;

    return { status: "OK" }
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return post
  } catch (error) {
    console.log(error)
  }
}

export async function editPost(post: IEditPost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    }

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: new URL(fileUrl), imageId: uploadedFile.$id };
    }


    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const editedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!editedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return editedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return { status: 'OK' }
  } catch (error) {
    console.log(error)
  }
}

export async function deleteSavesByPostId(postId: string) {
  if (!postId) throw Error;

  try {
    // List all saves associated with post
    const saves = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal('post', postId)]
    );

    // Iterate over the saves and delete each one
    const deletePromises = saves.documents.map((save) =>
      databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        save.$id
      )
    );

    await Promise.all(deletePromises);

    return { status: 'OK' };
  } catch (error) {
    console.log(error)
  }
};

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc('$createdAt'), Query.limit(12)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchQuery: string) {
  try {
    // Search posts by caption
    const captionResults = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.contains("caption", searchQuery)]
    );

    console.log(captionResults)

    // Search posts by location
    const locationResults = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.contains("location", searchQuery)]
    );

    // Search posts by tags (array fields require Query.contains instead of Query.search)
    const tagResults = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.contains("tags", searchQuery)]
    );

    // Extract documents safely
    const captionDocs = captionResults?.documents || [];
    const locationDocs = locationResults?.documents || [];
    const tagDocs = tagResults?.documents || [];

    // Merge results and remove duplicates using a Map
    const uniquePosts = new Map();
    [...captionDocs, ...locationDocs, ...tagDocs].forEach((post) => {
      uniquePosts.set(post.$id, post);
    });

    // Convert Map back to an array
    const mergedPosts = Array.from(uniquePosts.values());

    console.log("Posts Found:", mergedPosts);
    return { documents: mergedPosts }; // Ensure correct format
  } catch (error) {
    console.error("Search error:", error);
    return { documents: [] }; // Always return an array format
  }
}

export async function getRecentUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    )

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getTopPostedUsers(limit?: number) {
  const userQueries: any[] = [Query.orderDesc("$createdAt")];
  if (limit) {
    userQueries.push(Query.limit(limit));
  }

  try {
    // Fetch recent users from the user collection
    const usersResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userQueries
    );

    if (!usersResponse || !usersResponse.documents) {
      throw Error;
    }

    const users = usersResponse.documents;

    // For each user, fetch posts from the posts collection
    const usersWithPostCounts = await Promise.all(
      users.map(async (user: any) => {
        const postsResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          [Query.equal("creator", user.$id)]
        );

        // Calculate the post count (using .length, or use postsResponse.total if available)
        const postCount = postsResponse.documents.length;
        return { ...user, postCount };
      })
    );

    // Sort users by post count in descending order
    usersWithPostCounts.sort((a, b) => b.postCount - a.postCount);

    return usersWithPostCounts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTopFollowedUsers(limit?: number) {
  const userQueries: any[] = [Query.orderDesc("$createdAt")];
  if (limit) {
    userQueries.push(Query.limit(limit));
  }

  try {
    // Fetch recent users from the user collection
    const usersResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userQueries
    );

    if (!usersResponse || !usersResponse.documents) {
      throw Error;
    }

    const users = usersResponse.documents;

    // Sort users by followers count in descending order
    users.sort((a, b) => (b.followers?.length || 0) - (a.followers?.length || 0));

    return limit ? users.slice(0, limit) : users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPosts(userId: string) {
  try {
    const userPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId)]
    );

    if (!userPosts) throw Error;

    return userPosts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfiniteUserPosts({ pageParam, userId }: { pageParam: string, userId: string }) {
  const queries: any[] = [
    Query.equal("creator", userId),
    Query.orderDesc("$createdAt"),
    Query.limit(12),
  ];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam)); // No need for `.toString()` here
  }

  try {
    const userPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!userPosts) throw Error;

    return userPosts;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserLikedPosts(userId: string) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  try {
    const postsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!postsResponse || !postsResponse.documents) {
      throw Error;
    }

    const posts = postsResponse.documents;

    const userLikedPosts = posts.filter((post: any) => {
      return post.likes?.some((like: any) => {
        return like.$id === userId;
      });
    });

    return userLikedPosts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getInfiniteUserLikedPosts({
  pageParam,
  userId,
}: {
  pageParam?: string;
  userId: string;
}) {
  const limit = 20;
  let queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(limit)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    let postsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!postsResponse || !postsResponse.documents) {
      throw new Error("Failed to fetch posts.");
    }

    let posts = postsResponse.documents;

    let likedPosts: any[] = [];
    for (let post of posts) {
      if (post.likes?.some((like: any) => like.$id === userId)) {
        likedPosts.push(post);
      }
      if (likedPosts.length >= 12) break;
    }

    const lastPost = posts[posts.length - 1];
    const nextPage = lastPost ? lastPost.$id : null;

    return {
      documents: likedPosts,
      nextPage: likedPosts.length < 12 ? nextPage : null,
    };
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return { documents: [], nextPage: null };
  }
}

export async function getInfiniteUsers({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc('$createdAt'), Query.limit(12)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    )

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function searchUsers(searchQuery: string) {
  try {
    const nameResults = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("name", searchQuery)]
    );

    const usernameResults = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("username", searchQuery)]
    );

    const mergedUsers = [...nameResults.documents, ...usernameResults.documents].reduce((acc, user) => {
      if (!acc.some((existingUser) => existingUser.$id === user.$id)) {
        acc.push(user);
      }
      return acc;
    }, [] as Models.Document[]);

    return mergedUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function followUser(userId: string, followingUserId: string) {

  // Fetch the current user document to get the existing followers array
  try {
    const followRecord = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      ID.unique(),
      {
        userId: userId,
        followingUserId: followingUserId,
      }
    )

    if (!followRecord) {
      throw Error;
    }

    return followRecord;
  } catch (error) {
    console.log(error);
  }
}

export async function unfollowUser(followRecordId: string) {

  try {
    // Find the existing follow document
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followersCollectionId,
      followRecordId,
    );

    if (!statusCode) throw Error;

    return { status: "OK" }
  } catch (error) {
    console.log(error);
  }
}
