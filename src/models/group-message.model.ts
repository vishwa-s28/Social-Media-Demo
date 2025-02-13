import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class GroupMessage extends Model {
    static associate(models: any) {
      GroupMessage.belongsTo(models.GroupChat, {
        foreignKey: "group_id",
        as: "Group",
      });
      GroupMessage.belongsTo(models.User, {
        foreignKey: "sender_id",
        as: "Sender",
      });
    }
  }

  GroupMessage.init(
    {
      id: {
        type: dataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      group_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      sender_id: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GroupMessage",
      tableName: "group_messages",
      timestamps: true,
    }
  );

  return GroupMessage;
};
