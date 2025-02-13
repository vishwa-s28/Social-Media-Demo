import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Privacy extends Model {
    static associate(models: any) {
      Privacy.belongsTo(models.User, { foreignKey: "user_id" });
      Privacy.belongsTo(models.Post, { foreignKey: "post_id" });
    }
  }

  Privacy.init(
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
      post_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      privacy: {
        type: dataTypes.ENUM("public", "private", "friends_only"),
        defaultValue: "public",
      },
    },
    {
      sequelize,
      modelName: "Privacy",
      tableName: "privacy",
      timestamps: true,
    }
  );

  return Privacy;
};
