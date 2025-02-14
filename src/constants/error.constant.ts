const GENERAL_MESSAGES = {
  NOT_FOUND: "Not Found: Can't find the requested resource on this server",
  ACCESS_TOKEN_MISSING: "Access token is missing",
  TOKEN_EXPIRED: "Token expired",
  INVALID_TOKEN: "Invalid token",
  UNAUTHORIZED_ACCESS: "You are not authorized to access this resource",
  USER_NOT_FOUND: "The user does not exist.",
  PRIVACY_DENIED: "Access denied. This user's account is private.",
  PRIVACY_CHECK_ERROR: "An error occurred while checking privacy settings.",
  UNAUTHORIZED_LOGIN: "Unauthorized. Please log in.",
  INTERNA_SERVER_ERROR: "Internal Server Error",
  RATE_LIMIT_ERROR: "Too many requests, please try again later.",
};

const CONFIG_ERROR = {
  MISSING_DB_CONFIG:
    "Database configuration is incomplete. Check your environment variables.",
  SEQUELIZE_CONFIG: "Database configuration not found for environment:",
  SOCKET_CONFIG: "Socket.Io is not initialized",
};

const ADMIN_ERRORS = {
  ACCESS_DENIED: "Access denied, you are not an admin",
};

const AUTH_ERRORS = {
  MISSING_FIELDS: "Missing required fields: name, email, and password.",
  INVALID_EMAIL: "Invalid email address or undeliverable email.",
  EMAIL_EXISTS: "Email already exists. Please use a different email address.",
  LOGIN_REQUIRED: "Email and password are required.",
  INVALID_CREDENTIALS: "Invalid credentials. User not found.",
  INCORRECT_PASSWORD: "Invalid credentials. Incorrect password.",
  UNAUTHORIZED: "Unauthorized. No token provided.",
  LOGOUT_FAILED: "Logout failed. Invalid token.",
};

const BLOCK_ERRORS = {
  USER_NOT_FOUND: "User not found.",
  CANNOT_BLOCK_SELF: "You cannot block yourself.",
  USER_NOT_BLOCKED: "User is not blocked.",
  BLOCK_SUCCESS: "User has been successfully blocked.",
  UNBLOCK_SUCCESS: "User has been successfully unblocked.",
};

const CHAT_ERRORS = {
  MESSAGE_NOT_FOUND: "Message not found.",
  STATUS_UPDATE_SUCCESS: "Status updated successfully.",
  MESSAGE_DELETE_SUCCESS: "Message deleted successfully.",
};

const COMMENT_ERRORS = {
  UNAUTHORIZED: "Unauthorized. Please log in.",
  POST_NOT_FOUND: "Post not found.",
  COMMENT_NOT_FOUND: "Comment not found.",
  NO_COMMENTS_ON_POST: "No comments found on this post.",
  COMMENT_UPDATE_SUCCESS: "Comment updated successfully.",
  COMMENT_DELETE_SUCCESS: "Comment deleted successfully.",
};

const FRIENDSHIP_ERRORS = {
  SELF_FRIEND_REQUEST: "You cannot add yourself as a friend.",
  FRIENDSHIP_NOT_FOUND: "Friendship not found.",
  FRIENDSHIP_NOT_UPDATED: "Friendship not found or not updated.",
  FRIENDSHIP_DELETE_SUCCESS: "Friendship deleted successfully.",
  STATUS_UPDATE_SUCCESS: "Status updated successfully.",
};

const LIKE_ERRORS = {
  POST_NOT_FOUND: "Post not found.",
  COMMENT_NOT_FOUND: "Comment not found.",
  POST_LIKED_SUCCESS: "Post liked successfully.",
  COMMENT_LIKED_SUCCESS: "Comment liked successfully.",
};

const SUBSCRIPTION_ERRORS = {
  SUBSCRIPTION_REQUIRED: "Subscription object is required.",
  UNAUTHORIZED: "Unauthorized.",
  SUBSCRIPTION_ENABLED: "Notifications enabled successfully.",
  SUBSCRIPTION_DISABLED: "Notifications disabled successfully.",
};

const POST_ERRORS = {
  UNAUTHORIZED: "Unauthorized. Please log in.",
  POST_NOT_FOUND: "Post not found.",
  CONTENT_OR_CAPTION_REQUIRED: "Either 'content' or 'caption' is required.",
  UPDATE_FIELD_REQUIRED:
    "At least one field ('content' or 'caption') is required to update.",
  POST_CREATED: "Post created successfully.",
  POST_UPDATED: "Post updated successfully.",
  POST_DELETED: "Post deleted successfully.",
};

const SHARE_ERRORS = {
  UNAUTHORIZED: "Unauthorized. Please log in.",
  POST_NOT_FOUND: "Post not found.",
  POST_SHARED: "Post shared successfully.",
};

const TAG_ERRORS = {
  UNAUTHORIZED: "Unauthorized. Please log in.",
  POST_NOT_FOUND: "Post not found.",
  COMMENT_NOT_FOUND: "Comment not found.",
  USER_TAGGED: "User tagged successfully.",
};

export {
  GENERAL_MESSAGES,
  ADMIN_ERRORS,
  AUTH_ERRORS,
  BLOCK_ERRORS,
  CHAT_ERRORS,
  COMMENT_ERRORS,
  FRIENDSHIP_ERRORS,
  LIKE_ERRORS,
  SUBSCRIPTION_ERRORS,
  POST_ERRORS,
  SHARE_ERRORS,
  TAG_ERRORS,
  CONFIG_ERROR,
};
