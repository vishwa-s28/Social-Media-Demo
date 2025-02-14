import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Comment extends Model {
    static associate(models: any) {
      Comment.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Comment.belongsTo(models.Post, { foreignKey: "post_id", as: "post" });
      Comment.hasMany(models.Tag, { foreignKey: "comment_id" });
      Comment.hasMany(models.Like, {
        foreignKey: "comment_id",
        as: "commentLikes",
      });
      // Comment.belongsToMany(models.Post, {
      //   through: models.Tag,
      //   as: "TaggedComments",
      //   foreignKey: "comment_id",
      //   otherKey: "post_id",
      // });
      // Comment.belongsToMany(models.Post, {
      //   through: models.Like,
      //   as: "LikedComments",
      //   foreignKey: "comment_id",
      //   otherKey: "post_id",
      // });
    }
  }

  Comment.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      post_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      timestamps: true,
    }
  );

  return Comment;
};
