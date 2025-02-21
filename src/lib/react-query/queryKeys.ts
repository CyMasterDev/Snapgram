export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",

    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_TOP_FOLLOWED_USERS = "getTopFollowedUsers",
    GET_USER_BY_ID = "getUserById",
    GET_INFINITE_USERS = "getInfiniteUsers",
    
    // POST KEYS
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_POST_BY_ID = "getPostById",
    GET_FILE_PREVIEW = "getFilePreview",
    GET_INFINITE_USER_POSTS = "getInfiniteUserPosts",
    GET_INFINITE_USER_LIKED_POSTS = "getInfiniteUserLikedPosts",

    //  SEARCH KEYS
    SEARCH_POSTS = "getSearchPosts",
    SEARCH_USERS = "getSearchUsers",
}
