export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",

    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_USERS = "getUsers",
    GET_TOP_POSTED_USERS = "getTopPostedUsers",
    GET_TOP_FOLLOWED_USERS = "getTopFollowedUsers",
    GET_USER_BY_ID = "getUserById",
    GET_INFINITE_USERS = "getInfiniteUsers",
    GET_USER_POSTS = "getUserPosts",
    GET_INFINITE_USER_POSTS = "getInfiniteUserPosts",
    GET_USER_LIKED_POSTS = "getUserLikedPosts",
    GET_INFINITE_USER_LIKED_POSTS = "getInfiniteUserLikedPosts",

    // POST KEYS
    GET_POSTS = "getPosts",
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_RECENT_POSTS = "getRecentPosts",
    GET_TOP_LIKED_POSTS = "getTopLikedPosts",
    GET_POST_BY_ID = "getPostById",
    GET_FILE_PREVIEW = "getFilePreview",

    //  SEARCH KEYS
    SEARCH_POSTS = "getSearchPosts",
    SEARCH_USERS = "getSearchUsers",
}
