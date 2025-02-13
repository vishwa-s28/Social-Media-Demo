import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Tag extends Model {
    static associate(models: any) {
      Tag.belongsTo(models.User, { foreignKey: "user_id", as: "tagger" });
      Tag.belongsTo(models.User, { foreignKey: "tagged_id", as: "taggedUser" });
      Tag.belongsTo(models.Post, { foreignKey: "post_id" });
      Tag.belongsTo(models.Comment, {
        foreignKey: "comment_id",
      });
    }
  }

  Tag.init(
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
      tagged_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      post_id: {
        type: dataTypes.UUID,
        allowNull: true,
      },
      comment_id: {
        type: dataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      tableName: "tags",
      timestamps: true,
    }
  );

  return Tag;
};
