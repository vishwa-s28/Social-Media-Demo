import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class Friendship extends Model {
    static associate(models: any) {
      Friendship.belongsTo(models.User, {
        foreignKey: "friend_id",
        as: "Friend",
      });
      Friendship.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "Initiator",
      });
    }
  }

  Friendship.init(
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
      friend_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: dataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Friendship",
      tableName: "friendships",
      timestamps: true,
    }
  );

  return Friendship;
};
