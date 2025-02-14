import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class User extends Model {
    id!: string;
    username!: string;
    email!: string;
    password!: string;
    bio?: string;
    profile_image?: string;
    role!: "admin" | "user";
    profile_visibility!: "public" | "private";

    static associate(models: any) {
      User.hasMany(models.Post, { foreignKey: "user_id" });
      User.hasMany(models.Comment, { foreignKey: "user_id" });
      User.hasMany(models.Token, { foreignKey: "user_id" });
      User.hasMany(models.Chat, {
        foreignKey: "sender_id",
        as: "Sender",
      });
      User.hasMany(models.Chat, {
        foreignKey: "receiver_id",
        as: "Receiver",
      });
      User.hasMany(models.GroupChat, {
        foreignKey: "creator_id",
        as: "CreatedGroups",
      });
      User.hasMany(models.GroupMessage, {
        foreignKey: "sender_id",
        as: "GroupMessages",
      });
      User.hasMany(models.Tag, {
        foreignKey: "user_id",
        as: "tagger",
      });
      User.hasMany(models.Tag, {
        foreignKey: "tagged_id",
        as: "taggedUser",
      });
      User.hasMany(models.Like, {
        foreignKey: "user_id",
      });
      User.hasMany(models.Friendship, {
        foreignKey: "user_id",
        as: "FriendshipInitiator",
      });
      User.hasMany(models.Friendship, {
        foreignKey: "friend_id",
        as: "Friend",
      });
      User.hasMany(models.Block, { foreignKey: "blocker_id", as: "Blocker" });
      User.hasMany(models.Block, {
        foreignKey: "blocked_id",
        as: "Blocked",
      });
      User.hasMany(models.Share, { as: "SharesSent", foreignKey: "sender_id" });
      User.hasMany(models.Share, {
        as: "SharesReceived",
        foreignKey: "receiver_id",
      });

      // User.belongsToMany(models.User, {
      //   through: models.Share,
      //   as: "SentShares",
      //   foreignKey: "sender_id",
      //   otherKey: "receiver_id",
      // });
      // User.belongsToMany(models.User, {
      //   through: models.Share,
      //   as: "ReceivedShares",
      //   foreignKey: "receiver_id",
      //   otherKey: "sender_id",
      // });
      // User.belongsToMany(models.User, {
      //   through: models.Friendship,
      //   as: "Friends",
      //   foreignKey: "user_id",
      //   otherKey: "friend_id",
      // });
      // User.belongsToMany(models.Post, {
      //   through: models.Tag,
      //   as: "TaggedPosts",
      //   foreignKey: "user_id",
      //   otherKey: "post_id",
      // });
      // User.belongsToMany(models.Post, {
      //   through: models.Like,
      //   as: "LikedPosts",
      //   foreignKey: "user_id",
      //   otherKey: "post_id",
      // });
    }
  }

  User.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      profile_image: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: dataTypes.ENUM("admin", "user"),
        defaultValue: "user",
        allowNull: false,
      },
      profile_visibility: {
        type: dataTypes.ENUM("public", "private"),
        defaultValue: "public",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
