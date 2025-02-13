import * as dotenv from "dotenv";
dotenv.config();
import { Sequelize, DataTypes } from "sequelize";
import config from "../config/database";

// Importing models
import UserModel from "./user.model";
import PostModel from "./post.model";
import CommentModel from "./comment.model";
import FriendshipModel from "./friendship.model";
import ChatModel from "./chat.model";
import NotificationModel from "./notification.model";
import TagModel from "./tag.model";
import LikeModel from "./like.model";
import BlockModel from "./block.model";
import PrivacyModel from "./privacy.model";
import TokenModel from "./token.model";
import ShareModel from "./share.model";
import GroupChatModel from "./group-chat.model";
import GroupMessageModel from "./group-message.model";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

if (!dbConfig) {
  throw new Error(`Database configuration not found for environment: ${env}`);
}

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Initializing models
const User = UserModel(sequelize, DataTypes);
const Token = TokenModel(sequelize, DataTypes);
const Post = PostModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);
const Friendship = FriendshipModel(sequelize, DataTypes);
const Chat = ChatModel(sequelize, DataTypes);
const Notification = NotificationModel(sequelize, DataTypes);
const Tag = TagModel(sequelize, DataTypes);
const Like = LikeModel(sequelize, DataTypes);
const Block = BlockModel(sequelize, DataTypes);
const Privacy = PrivacyModel(sequelize, DataTypes);
const Share = ShareModel(sequelize, DataTypes);
const GroupChat = GroupChatModel(sequelize, DataTypes);
const GroupMessage = GroupMessageModel(sequelize, DataTypes);

const db = {
  sequelize,
  User,
  Token,
  Post,
  Comment,
  Friendship,
  Chat,
  Notification,
  Tag,
  Like,
  Block,
  Privacy,
  Share,
  GroupChat,
  GroupMessage,
  models: sequelize.models,
};

// Call `associate()` for each model to define relationships
Object.values(db.models).forEach((model: any) => {
  if (model.associate) {
    model.associate(db.models); // Pass all models to associate method
  }
});

export default db;
