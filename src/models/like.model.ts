import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Like extends Model {
    static associate(models: any) {
      Like.belongsTo(models.User, { foreignKey: "user_id" });
      Like.belongsTo(models.Comment, {
        foreignKey: "comment_id",
      });
      Like.belongsTo(models.Post, { foreignKey: "post_id" });
    }
  }

  Like.init(
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
      comment_id: {
        type: dataTypes.UUID,
        allowNull: true,
      },
      post_id: {
        type: dataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Like",
      tableName: "likes",
      timestamps: true,
    }
  );

  return Like;
};
