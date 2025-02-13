import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Post extends Model {
    static associate(models: any) {
      Post.belongsTo(models.User, { foreignKey: "user_id", as: "creator" });
      Post.hasMany(models.Comment, { foreignKey: "post_id" });
      Post.hasMany(models.Tag, { foreignKey: "post_id" });
      Post.hasMany(models.Like, { foreignKey: "post_id" });
      Post.hasMany(models.Privacy, { foreignKey: "post_id" });
      Post.hasMany(models.Share, { foreignKey: "post_id", as: "Shares" });
      Post.belongsToMany(models.User, {
        through: models.Tag,
        as: "TaggedUsers",
        foreignKey: "post_id",
        otherKey: "user_id",
      });
      Post.belongsToMany(models.User, {
        through: models.Like,
        as: "Likers",
        foreignKey: "post_id",
        otherKey: "user_id",
      });
      Post.belongsToMany(models.Comment, {
        through: models.Tag,
        as: "CommentsTags",
        foreignKey: "post_id",
        otherKey: "comment_id",
      });
      Post.belongsToMany(models.Comment, {
        through: models.Like,
        as: "CommentLikes",
        foreignKey: "post_id",
        otherKey: "comment_id",
      });
    }
  }

  Post.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      caption: {
        type: dataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
    }
  );

  return Post;
};
