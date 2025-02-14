const ENDPOINTS = {
  BASE: "/",
  AUTH: "/auth",
  ADMIN: "/admin",
  POSTS: "/posts",
  COMMENTS: "/comments",
  FRIENDSHIP: "/friendship",
  TAG: "/tag",
  LIKE: "/like",
  BLOCK: "/block",
  SHARE: "/share",
  CHAT: "/chat",
  NOTIFICATIONS: "/notifications",
};

const CLIENT = {
  CONFIG: "/config",
  PRIVATE_KEY: "/",
};

const ADMIN = {
  POSTS: "/posts",
};

const AUTH = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
};

const BLOCK = {
  BASE: "/",
  UNBLOCK: "/unblock",
};

const CHAT = {
  SEND: "/send",
  HISTORY: "/history",
  MESSAGE: "/message/:id",
};

const COMMENTS = {
  BY_USER: "/by_user",
  ON_POST: "/on_post",
  ON_POST_ID: "/on_post/:id",
  DELETE_ON_POST: "/delete_on_post/:id",
};

const POST = {
  BASE: "/",
  BY_ID: "/:id",
};

const FRIENDSHIP = {
  BASE: "/",
  ALL_FRIENDS: "/all_friends",
  FRIENDSHIP_ID: "/:id",
};

const LIKE = {
  POST: "/post",
  COMMENT: "/comment",
};

const NOTIFICATIONS = {
  ENABLE: "/enable",
  DISABLE: "/disable",
};

const SHARE = {
  POST: "/post",
};

const TAG = {
  POST: "/post",
  COMMENT: "/comment",
};

export {
  ENDPOINTS,
  ADMIN,
  AUTH,
  BLOCK,
  CHAT,
  CLIENT,
  COMMENTS,
  POST,
  FRIENDSHIP,
  LIKE,
  NOTIFICATIONS,
  SHARE,
  TAG,
};
