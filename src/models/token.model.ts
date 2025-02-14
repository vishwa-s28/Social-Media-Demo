import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Token extends Model {
    static associate(models: any) {
      Token.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }

  Token.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      user_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      push_subscription: {
        type: dataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Token",
      tableName: "tokens",
      timestamps: true,
      underscored: true,
    }
  );

  return Token;
};
